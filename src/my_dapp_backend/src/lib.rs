use candid:: {CandidType, Deserialize, Principal};
use ic_cdk::api::caller;
use std::collections::HashMap;
use std::cell::RefCell;

//defining data structures sabke
//user role
#[derive(CandidType, Deserialize, Clone)]
pub enum UserRole{
    Manufacturer,
    Distributor,
    Retailer,
    Customer,
}
//user struct
#[derive(CandidType,Deserialize,Clone)]
pub struct User{
    pub principal: Principal,
    pub name: String,
    pub role: UserRole,
    pub email: Option<String>,
    pub company: Option<String>,
    pub is_active: bool,
    pub created_at: u64,
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
    let timestamp = get_current_timestamp();
    let random = ic_cdk::api::caller().as_slice();
    //xor karke id generate kar rahe hai
    format!("{}{:x}",timestamp,random.iter().take(4).fold(0u8, |acc, &x| acc ^ x))
}

fn get_caller() -> Principal {
    ic_cdk::api::caller()
}

// ===== USER MANAGEMENT =====

//register user
#[ic_cdk::update]
pub fn register_user(
    name:String,
    role:UserRole,
    email:Option<String>,
    company:Option<String>,

) -> Result<User,String>{
    //get the caller
    //check if user already exists
    //create user
    //store user to apna hashmap
    //return success ya phir error
    let caller = get_caller();
    USERS.with(|users| {
        let mut users = users.borrow_mut();

        if users.contains_key(&caller){
            return Err("User already registered".to_string());
        }

        let user = User{
            principal:caller,
            name,
            role,
            email,
            company,
            is_active:true,
            created_at:get_current_timestamp(),
        }

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
pub fn get_current_user() -> Option<User> {
   let caller = get_caller();
   get_user(caller)
}

//update user role
#[ic_cdk::update]
pub fn update_user_role(role:UserRole) -> Result<User,String>{
    let caller = get_caller();
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(user) = users.get_mut(&caller){
            user.role = role;
            Ok(user.clone())
        } else {
            Err("User not found".to_string())
        }
    })

}









// ===== DATA STRUCTURES =====
// ===== STORAGE =====
// ===== UTILITY FUNCTIONS =====
// ===== USER MANAGEMENT =====





// #[derive(CandidType, Deserialize, Clone)]
// pub enum OrderStatus {
//     Pending,
//     Confirmed,
//     InTransit,
//     Delivered,
//     Cancelled,
// }

// #[derive(CandidType, Deserialize, Clone)]
// pub struct OrderItem {
//     pub product_id: String,
//     pub quantity: u32,
//     pub unit_price: f64,
// }

// #[derive(CandidType, Deserialize, Clone)]
// pub struct Order {
//     pub id: String,
//     pub customer: Principal,
//     pub items: Vec<OrderItem>,
//     pub total_amount: f64,
//     pub status: OrderStatus,
//     pub created_at: u64,
//     pub updated_at: u64,
//     pub shipping_address: String,
//     pub notes: Option<String>,
// }



// thread_local! {
//     static USERS: RefCell<HashMap<Principal, User>> = RefCell::new(HashMap::new());
//     static PRODUCTS: RefCell<HashMap<String, Product>> = RefCell::new(HashMap::new());
//     static ORDERS: RefCell<HashMap<String, Order>> = RefCell::new(HashMap::new());
//     static SUPPLY_CHAIN_EVENTS: RefCell<Vec<SupplyChainEvent>> = RefCell::new(Vec::new());
// }


