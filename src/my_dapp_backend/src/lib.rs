use candid:: {CandidType, Deserialize, Principal};
use std::collections::HashMap;
use std::cell::RefCell;

//defining data structures sabke
//user role
#[derive(CandidType, Deserialize, Clone, PartialEq)]
pub enum UserRole{
    Manufacturer,
    Distributor,
    Retailer,
    Customer,
}
//user struct
#[derive(CandidType,Deserialize,Clone)]
pub struct User{
    pub user_principal: Principal,
    pub name: String,
    pub role: UserRole,
    pub email: String,
    pub company: String,
    pub is_active: bool,
    pub created_at: u64
   
}

//product status
#[derive(CandidType, Deserialize, Clone)]
pub enum ProductStatus{
    Available,
    OutOfStock,
    Discontinued,
}


//product struct
#[derive(CandidType, Deserialize, Clone)]
pub struct Product{
    pub id:String,
    pub name:String,
    pub description:String,
    pub manufacturer:Principal,
    pub current_owner: Principal, // NEW FIELD
    pub price:f64,
    pub quantity:u32,
    pub status:ProductStatus,
    pub category:String,
    pub created_at:u64,
    pub updated_at:u64,
}

//product kaha ghum ke aaya uska struct
#[derive(CandidType, Deserialize, Clone)]
pub struct ProductEvent{
    pub product_id:String,
    pub event_type:String,
    pub description:String,
    pub from_user:Principal,
    pub to_user:Principal,
    pub timestamp:u64,
}

//Storage

thread_local! {
    static USERS: RefCell<HashMap<Principal, User>> = RefCell::new(HashMap::new());
    static PRODUCTS: RefCell<HashMap<String,Product>> = RefCell::new(HashMap::new());
    static PRODUCT_EVENTS: RefCell<Vec<ProductEvent>> = RefCell::new(Vec::new());
}

//lets create utility functions
fn get_current_timestamp() -> u64
{
    ic_cdk::api::time()
}

fn generate_id() -> String{
    let caller = ic_cdk::api::caller();
    let random = caller.as_slice();
    //xor karke id generate kar rahe hai
    format!("{}{:x}",get_current_timestamp(),random.iter().take(4).fold(0u8, |acc, &x| acc ^ x))
}

fn get_caller() -> Principal {
    ic_cdk::api::caller()
}

fn add_product_event(
    product_id: String,
    event_type: String,
    from_user: Principal,
    to_user: Principal,
    description: String,
    timestamp: u64,
) {
    let event = ProductEvent {
        product_id,
        event_type,
        from_user,
        to_user,
        description,
        timestamp,
    };
    PRODUCT_EVENTS.with(|events| {
        events.borrow_mut().push(event);
    });
}

// ===== USER MANAGEMENT =====

//register user
#[ic_cdk::update]
pub fn register_user(
    name:String,
    role:UserRole,
    email:String,
    company:String,
) -> Result<User,String>{
    let caller = get_caller();
    
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        
        // Check if user already exists
        if users.contains_key(&caller){
            return Err("User already registered".to_string());
        }
        
        let user = User{
            user_principal:caller,
            name,
            role,
            email,
            company,
            is_active:true,
            created_at:get_current_timestamp(),
        };
        users.insert(caller, user.clone());
        Ok(user)
    })
}

//get user
#[ic_cdk::query]
pub fn get_user(principal: Principal) -> Option<User> {
    USERS.with(|users| {
        users.borrow().get(&principal).cloned()
    })
}

//get current user
#[ic_cdk::query]
pub fn get_current_user() -> Option<User>{
    let caller = get_caller();
    get_user(caller)
}

//update user role
#[ic_cdk::update]
pub fn update_user_role(role:UserRole) -> Result<User,String>{
    let caller = get_caller();
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(user) = users.get_mut(&caller) {
            user.role = role;
            Ok(user.clone())
        } else {
            Err("User not found".to_string())
        }
    })
}

// ===== PRODUCT MANAGEMENT =====

//create product
#[ic_cdk::update]
pub fn create_product(
    name:String,
    description:String,
    price:f64,
    quantity:u32,
    category:String
) -> Result<Product,String>{
    let caller = get_caller();
    let current_user = get_current_user();
    
    if let Some(user) = current_user{
        match user.role{
            UserRole::Manufacturer => {},
            _ => return Err("Only manufacturers can create products".to_string())
        }
        let product_id = generate_id();
        let product = Product{
            id:product_id.clone(),
            name:name.clone(),
            description,
            manufacturer:caller,
            current_owner: caller, // Set current_owner to manufacturer
            price,
            quantity,
            status:ProductStatus::Available,
            category,
            created_at:get_current_timestamp(),
            updated_at:get_current_timestamp(),
        };
        PRODUCTS.with(|products| {
            let mut products = products.borrow_mut();
            products.insert(product_id.clone(), product.clone());
        });
        add_product_event(
            product_id,
            "Created".to_string(),
            caller,
            caller,
            format!("Product {} created by {}",name,user.name),
            get_current_timestamp(),
        );
        Ok(product)
    } else {
        Err("User not logged in".to_string())
    }
}

//transfer product
#[ic_cdk::update]
pub fn transfer_product(
    product_id: String,
    to_user: Principal,
    description: String,
) -> Result<Product, String> {
    let caller = get_caller();
    let current_user = get_current_user();
    
    if let Some(user) = current_user {
        // Check if user can transfer (Manufacturer, Distributor, or Retailer)
        match user.role {
            UserRole::Manufacturer | UserRole::Distributor | UserRole::Retailer => {},
            _ => return Err("Only manufacturers, distributors, and retailers can transfer products".to_string())
        }
        
        PRODUCTS.with(|products| {
            let mut products = products.borrow_mut();
            
            if let Some(product) = products.get_mut(&product_id) {
                // Check if the caller is the current owner
                if product.current_owner != caller {
                    return Err("You can only transfer products you own".to_string());
                }
                
                // Update the product ownership
                let from_user = product.current_owner;
                product.current_owner = to_user;
                product.updated_at = get_current_timestamp();
                
                // Add transfer event
                add_product_event(
                    product_id.clone(),
                    "Transferred".to_string(),
                    from_user,
                    to_user,
                    description,
                    get_current_timestamp(),
                );
                
                Ok(product.clone())
            } else {
                Err("Product not found".to_string())
            }
        })
    } else {
        Err("User not logged in".to_string())
    }
}

//sell product
#[ic_cdk::update]
pub fn sell_product(
    product_id: String,
    customer: Principal,
    _price: f64,
    quantity: u32,
    description: String,
) -> Result<Product, String> {
    let caller = get_caller();
    let current_user = get_current_user();
    
    if let Some(user) = current_user {
        // Only retailers can sell products
        match user.role {
            UserRole::Retailer => {},
            _ => return Err("Only retailers can sell products".to_string())
        }
        
        PRODUCTS.with(|products| {
            let mut products = products.borrow_mut();
            
            if let Some(product) = products.get_mut(&product_id) {
                // Check if the caller is the current owner
                if product.current_owner != caller {
                    return Err("You can only sell products you own".to_string());
                }
                
                // Update the product ownership to customer
                let from_user = product.current_owner;
                product.current_owner = customer;
                product.updated_at = get_current_timestamp();
                
                // Add sale event
                add_product_event(
                    product_id.clone(),
                    "Sold".to_string(),
                    from_user,
                    customer,
                    description,
                    get_current_timestamp(),
                );
                
                Ok(product.clone())
            } else {
                Err("Product not found".to_string())
            }
        })
    } else {
        Err("User not logged in".to_string())
    }
}

// ===== QUERY FUNCTIONS =====

#[ic_cdk::query]
pub fn get_product_events(product_id: String) -> Vec<ProductEvent> {
    PRODUCT_EVENTS.with(|events| {
        events.borrow()
            .iter()
            .filter(|event| event.product_id == product_id)
            .cloned()
            .collect()
    })
}

#[ic_cdk::query]
pub fn get_all_products() -> Vec<Product> {
    PRODUCTS.with(|products| {
        products.borrow().values().cloned().collect()
    })
}

#[ic_cdk::query]
pub fn get_product(product_id: String) -> Option<Product> {
    PRODUCTS.with(|products| {
        products.borrow().get(&product_id).cloned()
    })
}



