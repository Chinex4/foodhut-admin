import type { Ad, AdPayload } from "@/types/ad";
import type { AreaCity, AreaCityPayload } from "@/types/areaCity";
import type { AuthTokens, OtpPayload, UserProfile } from "@/types/auth";
import type { DashboardAnalyticsPoint, DashboardInfo } from "@/types/dashboard";
import type { Kitchen, KitchenUpdatePayload } from "@/types/kitchen";
import type { Meal, MealPayload } from "@/types/meal";
import type { Order } from "@/types/order";
import type { Rider, RiderKycStatus } from "@/types/rider";
import type { SearchResults } from "@/types/search";
import type { Transaction } from "@/types/transaction";

type Meta = { page: number; per_page: number; total: number };
type Paginated<T> = { items: T[]; meta: Meta };

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const delay = async (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const paginate = <T>(items: T[], page = 1, perPage = 20): Paginated<T> => {
  const safePage = Math.max(page, 1);
  const total = items.length;
  const start = (safePage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    meta: { page: safePage, per_page: perPage, total },
  };
};

const today = new Date().toISOString();

let kitchens: Kitchen[] = [
  {
    id: "k-101",
    name: "Mainland Grill House",
    city: { name: "Lagos", state: "Lagos" },
    address: "32 Admiralty Way, Lekki Phase 1",
    cover_image: { url: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=1200" },
    phone_number: "+2348012341001",
    type: "Grills",
    rating: 4.8,
    likes: 812,
    opening_time: "08:00",
    closing_time: "23:00",
    delivery_time: "30-45 mins",
    preparation_time: "15-25 mins",
    description: "Charcoal grilled specials and family platters.",
    is_blocked: false,
    is_verified: true,
    owner: "Adewale Johnson",
    created_at: today,
  },
  {
    id: "k-102",
    name: "Eko Salad Studio",
    city: { name: "Lagos", state: "Lagos" },
    address: "12 Isaac John Street, GRA Ikeja",
    cover_image: { url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200" },
    phone_number: "+2348012341002",
    type: "Healthy",
    rating: 4.4,
    likes: 376,
    opening_time: "09:00",
    closing_time: "21:00",
    delivery_time: "25-35 mins",
    preparation_time: "10-20 mins",
    description: "Fresh salads, wraps, and protein bowls.",
    is_blocked: false,
    is_verified: false,
    owner: "Amara Obi",
    created_at: today,
  },
  {
    id: "k-103",
    name: "Abuja Pasta Lab",
    city: { name: "Abuja", state: "FCT" },
    address: "18 Ademola Adetokunbo Crescent, Wuse 2",
    cover_image: { url: "https://images.unsplash.com/photo-1521389508051-d7ffb5dc8d5f?w=1200" },
    phone_number: "+2348012341003",
    type: "Italian",
    rating: 4.6,
    likes: 502,
    opening_time: "10:00",
    closing_time: "22:00",
    delivery_time: "35-50 mins",
    preparation_time: "20-30 mins",
    description: "Fresh pasta and sauces made daily.",
    is_blocked: true,
    is_verified: true,
    owner: "Daniel Musa",
    created_at: today,
  },
];

let meals: Meal[] = [
  {
    id: "m-201",
    name: "Smoky Jollof + Chicken",
    price: 4500,
    kitchen_id: "k-101",
    description: "Party jollof, grilled chicken thigh, and fried plantain.",
    cover_image: { url: "https://images.unsplash.com/photo-1604908176997-4318c4d2b708?w=1000" },
    is_available: true,
    rating: 4.7,
    likes: 521,
    created_at: today,
  },
  {
    id: "m-202",
    name: "Beef Suya Wrap",
    price: 3900,
    kitchen_id: "k-101",
    description: "Spiced beef strips, mayo, cabbage, and onions.",
    cover_image: { url: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=1000" },
    is_available: true,
    rating: 4.5,
    likes: 410,
    created_at: today,
  },
  {
    id: "m-203",
    name: "Greek Chicken Salad",
    price: 5200,
    kitchen_id: "k-102",
    description: "Lettuce, olives, feta, grilled chicken, and house dressing.",
    cover_image: { url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000" },
    is_available: true,
    rating: 4.3,
    likes: 288,
    created_at: today,
  },
  {
    id: "m-204",
    name: "Pesto Fusilli",
    price: 5800,
    kitchen_id: "k-103",
    description: "Basil pesto, parmesan, roasted cherry tomatoes.",
    cover_image: { url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1000" },
    is_available: false,
    rating: 4.6,
    likes: 317,
    created_at: today,
  },
  {
    id: "m-205",
    name: "Creamy Alfredo Penne",
    price: 6200,
    kitchen_id: "k-103",
    description: "Cream sauce, mushrooms, garlic bread side.",
    cover_image: { url: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=1000" },
    is_available: true,
    rating: 4.4,
    likes: 260,
    created_at: today,
  },
];

let riders: Rider[] = [
  {
    id: "r-301",
    full_name: "Chinedu Okeke",
    phone_number: "+2348091112221",
    email: "chinedu.rider@foodhut.app",
    city: "Lagos",
    area: "Lekki",
    vehicle_type: "Bike",
    plate_number: "LSD-482KD",
    status: "active",
    kyc_status: "approved",
    completed_orders: 412,
    rating: 4.8,
    current_location: "Lekki Phase 1",
    profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    kyc_documents: ["National ID", "Driver License", "Utility Bill"],
    created_at: today,
  },
  {
    id: "r-302",
    full_name: "Fatima Yusuf",
    phone_number: "+2348091112222",
    email: "fatima.rider@foodhut.app",
    city: "Lagos",
    area: "Yaba",
    vehicle_type: "Bike",
    plate_number: "LND-739AX",
    status: "offline",
    kyc_status: "pending",
    completed_orders: 96,
    rating: 4.5,
    current_location: "Sabo Yaba",
    profile_image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600",
    kyc_documents: ["National ID", "Rider Card"],
    created_at: today,
  },
  {
    id: "r-303",
    full_name: "Ibrahim Bello",
    phone_number: "+2348091112223",
    email: "ibrahim.rider@foodhut.app",
    city: "Abuja",
    area: "Wuse",
    vehicle_type: "Bike",
    plate_number: "ABJ-920RF",
    status: "blocked",
    kyc_status: "rejected",
    completed_orders: 37,
    rating: 3.8,
    current_location: "Wuse 2",
    profile_image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600",
    kyc_documents: ["Voter Card"],
    created_at: today,
  },
];

let orders: Order[] = [
  {
    id: "o-401",
    kitchen_id: "k-101",
    kitchen: {
      name: "Mainland Grill House",
      city: "Lagos",
      address: "32 Admiralty Way, Lekki Phase 1",
      phone_number: "+2348012341001",
      type: "Grills",
    },
    rider: {
      id: "r-301",
      full_name: "Chinedu Okeke",
      phone_number: "+2348091112221",
      vehicle_type: "Bike",
      plate_number: "LSD-482KD",
      kyc_status: "approved",
      status: "active",
    },
    items: [
      { meal_id: "m-201", meal: meals.find((meal) => meal.id === "m-201"), price: 4500, quantity: 1 },
      { meal_id: "m-202", meal: meals.find((meal) => meal.id === "m-202"), price: 3900, quantity: 1 },
    ],
    status: "delivered",
    payment_method: "card",
    sub_total: 8400,
    delivery_fee: 1000,
    service_fee: 200,
    total: 9600,
    pickup_location: "32 Admiralty Way, Lekki Phase 1",
    dropoff_location: "18 Fola Osibo Road, Lekki",
    delivery_address: "18 Fola Osibo Road, Lekki",
    created_at: today,
  },
  {
    id: "o-402",
    kitchen_id: "k-102",
    kitchen: {
      name: "Eko Salad Studio",
      city: "Lagos",
      address: "12 Isaac John Street, GRA Ikeja",
      phone_number: "+2348012341002",
      type: "Healthy",
    },
    rider: {
      id: "r-302",
      full_name: "Fatima Yusuf",
      phone_number: "+2348091112222",
      vehicle_type: "Bike",
      plate_number: "LND-739AX",
      kyc_status: "pending",
      status: "offline",
    },
    items: [{ meal_id: "m-203", meal: meals.find((meal) => meal.id === "m-203"), price: 5200, quantity: 2 }],
    status: "preparing",
    payment_method: "wallet",
    sub_total: 10400,
    delivery_fee: 900,
    service_fee: 250,
    total: 11550,
    pickup_location: "12 Isaac John Street, GRA Ikeja",
    dropoff_location: "7 Hughes Avenue, Alagomeji Yaba",
    delivery_address: "7 Hughes Avenue, Alagomeji Yaba",
    created_at: today,
  },
  {
    id: "o-403",
    kitchen_id: "k-103",
    kitchen: {
      name: "Abuja Pasta Lab",
      city: "Abuja",
      address: "18 Ademola Adetokunbo Crescent, Wuse 2",
      phone_number: "+2348012341003",
      type: "Italian",
    },
    rider: {
      id: "r-303",
      full_name: "Ibrahim Bello",
      phone_number: "+2348091112223",
      vehicle_type: "Bike",
      plate_number: "ABJ-920RF",
      kyc_status: "rejected",
      status: "blocked",
    },
    items: [{ meal_id: "m-205", meal: meals.find((meal) => meal.id === "m-205"), price: 6200, quantity: 1 }],
    status: "cancelled",
    payment_method: "bank_transfer",
    sub_total: 6200,
    delivery_fee: 0,
    service_fee: 0,
    total: 6200,
    pickup_location: "18 Ademola Adetokunbo Crescent, Wuse 2",
    dropoff_location: "No. 4 Obafemi Awolowo Way, Jabi",
    delivery_address: "No. 4 Obafemi Awolowo Way, Jabi",
    created_at: today,
  },
];

let transactions: Transaction[] = [
  {
    id: "t-501",
    order_id: "o-401",
    amount: 9600,
    status: "successful",
    payment_method: "card",
    reference: "FH-TRX-9601",
    created_at: today,
  },
  {
    id: "t-502",
    order_id: "o-402",
    amount: 11550,
    status: "pending",
    payment_method: "wallet",
    reference: "FH-TRX-9602",
    created_at: today,
  },
  {
    id: "t-503",
    order_id: "o-403",
    amount: 6200,
    status: "failed",
    payment_method: "bank_transfer",
    reference: "FH-TRX-9603",
    created_at: today,
  },
];

let ads: Ad[] = [
  {
    id: "a-601",
    title: "Weekend Shawarma Fest",
    image_url: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=1000",
    link: "https://foodhut.app/promos/shawarma-fest",
    is_active: true,
    created_at: today,
  },
  {
    id: "a-602",
    title: "Healthy Bowl Combo",
    image_url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=1000",
    link: "https://foodhut.app/promos/healthy-bowl",
    is_active: false,
    created_at: today,
  },
];

let areaCities: AreaCity[] = [
  { id: "ac-701", city: "Lagos", area: "Lekki", is_active: true, created_at: today },
  { id: "ac-702", city: "Lagos", area: "Yaba", is_active: true, created_at: today },
  { id: "ac-703", city: "Abuja", area: "Wuse", is_active: true, created_at: today },
  { id: "ac-704", city: "Abuja", area: "Jabi", is_active: false, created_at: today },
];

const mockTokens: AuthTokens = {
  access_token: "mock-admin-access-token",
  refresh_token: "mock-admin-refresh-token",
};

const mockProfile: UserProfile = {
  id: "u-admin-1",
  email: "admin@foodhut.app",
  phone_number: "+2348123456789",
  is_verified: true,
  first_name: "Foodhut",
  last_name: "Admin",
  has_kitchen: false,
  birthday: null,
  referral_code: null,
  profile_picture_url: null,
  created_at: today,
  updated_at: null,
};

const findKitchen = (id: string) => kitchens.find((kitchen) => kitchen.id === id);

const syncOrderReferences = () => {
  orders = orders.map((order) => ({
    ...order,
    kitchen: {
      ...order.kitchen,
      name: findKitchen(order.kitchen_id)?.name ?? order.kitchen?.name,
      city: findKitchen(order.kitchen_id)?.city ?? order.kitchen?.city,
      address: findKitchen(order.kitchen_id)?.address ?? order.kitchen?.address,
      type: findKitchen(order.kitchen_id)?.type ?? order.kitchen?.type,
      phone_number: findKitchen(order.kitchen_id)?.phone_number ?? order.kitchen?.phone_number,
    },
    items: order.items.map((item) => ({
      ...item,
      meal: meals.find((meal) => meal.id === item.meal_id) ?? item.meal,
    })),
  }));
};

const idWithPrefix = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 6)}${Date.now().toString().slice(-4)}`;

export const mockAuth = {
  sendOtp: async (_phoneNumber: string) => {
    await delay();
  },
  resendOtp: async (_phoneNumber: string) => {
    await delay();
  },
  verifyOtp: async (_payload: OtpPayload): Promise<AuthTokens> => {
    await delay();
    return clone(mockTokens);
  },
  refreshTokens: async (_token: string): Promise<AuthTokens> => {
    await delay();
    return clone(mockTokens);
  },
  fetchProfile: async (): Promise<UserProfile> => {
    await delay();
    return clone(mockProfile);
  },
};

export const mockDashboard = {
  getInfo: async (): Promise<DashboardInfo> => {
    await delay();
    return {
      kitchens: kitchens.length,
      meals: meals.length,
      orders: orders.length,
      transactions: transactions.length,
    };
  },
  getAnalytics: async (): Promise<DashboardAnalyticsPoint[]> => {
    await delay();
    return [
      { name: "Mon", value: 14 },
      { name: "Tue", value: 19 },
      { name: "Wed", value: 13 },
      { name: "Thu", value: 27 },
      { name: "Fri", value: 31 },
      { name: "Sat", value: 24 },
      { name: "Sun", value: 18 },
    ];
  },
};

export const mockKitchensDb = {
  fetchAll: async (page = 1): Promise<Paginated<Kitchen>> => {
    await delay();
    return clone(paginate(kitchens, page, 20));
  },
  fetchTypes: async (): Promise<string[]> => {
    await delay();
    return Array.from(new Set(kitchens.map((kitchen) => kitchen.type).filter(Boolean) as string[]));
  },
  fetchCities: async (): Promise<string[]> => {
    await delay();
    return Array.from(
      new Set(
        kitchens.map((kitchen) => {
          if (typeof kitchen.city === "object" && kitchen.city !== null) {
            return kitchen.city.name ?? "";
          }
          return kitchen.city ?? "";
        }),
      ),
    ).filter(Boolean);
  },
  fetchById: async (id: string): Promise<Kitchen> => {
    await delay();
    const kitchen = findKitchen(id);
    if (!kitchen) {
      throw new Error("Kitchen not found");
    }
    return clone(kitchen);
  },
  updateById: async (id: string, payload: KitchenUpdatePayload): Promise<Kitchen> => {
    await delay();
    const index = kitchens.findIndex((kitchen) => kitchen.id === id);
    if (index < 0) {
      throw new Error("Kitchen not found");
    }
    kitchens[index] = { ...kitchens[index], ...payload };
    syncOrderReferences();
    return clone(kitchens[index]);
  },
  updateCover: async (id: string, cover_image_url: string): Promise<Kitchen> => {
    await delay();
    const index = kitchens.findIndex((kitchen) => kitchen.id === id);
    if (index < 0) {
      throw new Error("Kitchen not found");
    }
    kitchens[index] = { ...kitchens[index], cover_image: { url: cover_image_url }, cover_image_url };
    return clone(kitchens[index]);
  },
  setBlocked: async (id: string, blocked: boolean): Promise<Kitchen> => {
    await delay();
    const index = kitchens.findIndex((kitchen) => kitchen.id === id);
    if (index < 0) {
      throw new Error("Kitchen not found");
    }
    kitchens[index] = { ...kitchens[index], is_blocked: blocked };
    return clone(kitchens[index]);
  },
  setVerified: async (id: string, verified: boolean): Promise<Kitchen> => {
    await delay();
    const index = kitchens.findIndex((kitchen) => kitchen.id === id);
    if (index < 0) {
      throw new Error("Kitchen not found");
    }
    kitchens[index] = { ...kitchens[index], is_verified: verified };
    return clone(kitchens[index]);
  },
};

export const mockMealsDb = {
  fetchAll: async (page = 1): Promise<Paginated<Meal>> => {
    await delay();
    return clone(paginate(meals, page, 20));
  },
  fetchById: async (id: string): Promise<Meal> => {
    await delay();
    const meal = meals.find((item) => item.id === id);
    if (!meal) {
      throw new Error("Meal not found");
    }
    return clone(meal);
  },
  createFromFormData: async (payload: FormData): Promise<Meal> => {
    await delay();
    const id = idWithPrefix("m");
    const name = String(payload.get("name") ?? "");
    const description = String(payload.get("description") ?? "");
    const kitchen_id = String(payload.get("kitchen_id") ?? "");
    const price = Number(payload.get("price") ?? 0);
    const newMeal: Meal = {
      id,
      name,
      description,
      kitchen_id,
      price,
      is_available: true,
      rating: 0,
      likes: 0,
      cover_image: {
        url: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&sig=${id}`,
      },
      created_at: new Date().toISOString(),
    };
    meals = [newMeal, ...meals];
    syncOrderReferences();
    return clone(newMeal);
  },
  updateById: async (id: string, payload: Partial<MealPayload>): Promise<Meal> => {
    await delay();
    const index = meals.findIndex((meal) => meal.id === id);
    if (index < 0) {
      throw new Error("Meal not found");
    }
    meals[index] = { ...meals[index], ...payload };
    syncOrderReferences();
    return clone(meals[index]);
  },
  deleteById: async (id: string): Promise<string> => {
    await delay();
    meals = meals.filter((meal) => meal.id !== id);
    syncOrderReferences();
    return id;
  },
};

export const mockOrdersDb = {
  fetchAll: async (page = 1): Promise<Paginated<Order>> => {
    await delay();
    return clone(paginate(orders, page, 20));
  },
};

export const mockTransactionsDb = {
  fetchAll: async (): Promise<Transaction[]> => {
    await delay();
    return clone(transactions);
  },
  fetchById: async (id: string): Promise<Transaction> => {
    await delay();
    const transaction = transactions.find((item) => item.id === id);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return clone(transaction);
  },
};

export const mockAdsDb = {
  fetchAll: async (): Promise<Ad[]> => {
    await delay();
    return clone(ads);
  },
  fetchById: async (id: string): Promise<Ad> => {
    await delay();
    const ad = ads.find((item) => item.id === id);
    if (!ad) {
      throw new Error("Ad not found");
    }
    return clone(ad);
  },
  create: async (payload: AdPayload): Promise<Ad> => {
    await delay();
    const newAd: Ad = {
      ...payload,
      id: idWithPrefix("a"),
      created_at: new Date().toISOString(),
    };
    ads = [newAd, ...ads];
    return clone(newAd);
  },
  update: async (id: string, payload: Partial<AdPayload>): Promise<Ad> => {
    await delay();
    const index = ads.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("Ad not found");
    }
    ads[index] = { ...ads[index], ...payload };
    return clone(ads[index]);
  },
  deleteById: async (id: string): Promise<string> => {
    await delay();
    ads = ads.filter((ad) => ad.id !== id);
    return id;
  },
};

export const mockSearchDb = {
  search: async (term: string, page = 1): Promise<SearchResults> => {
    await delay();
    const needle = term.trim().toLowerCase();
    if (!needle) {
      return { items: [], meals: [], kitchens: [], meta: { page: 1, per_page: 10, total: 0 } };
    }
    const matchedMeals = meals.filter((meal) => meal.name.toLowerCase().includes(needle));
    const matchedKitchens = kitchens.filter((kitchen) => kitchen.name.toLowerCase().includes(needle));
    const combined = [...matchedMeals, ...matchedKitchens];
    const paginated = paginate(combined, page, 10);
    return {
      items: clone(paginated.items),
      meals: clone(matchedMeals),
      kitchens: clone(matchedKitchens),
      meta: paginated.meta,
    };
  },
};

export const mockRidersDb = {
  fetchAll: async (): Promise<Rider[]> => {
    await delay();
    return clone(riders);
  },
  fetchById: async (id: string): Promise<Rider> => {
    await delay();
    const rider = riders.find((item) => item.id === id);
    if (!rider) {
      throw new Error("Rider not found");
    }
    return clone(rider);
  },
  setKycStatus: async (id: string, kycStatus: RiderKycStatus): Promise<Rider> => {
    await delay();
    const index = riders.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("Rider not found");
    }
    riders[index] = {
      ...riders[index],
      kyc_status: kycStatus,
      status: kycStatus === "rejected" ? "blocked" : riders[index].status,
    };
    orders = orders.map((order) =>
      order.rider?.id === id
        ? {
            ...order,
            rider: order.rider
              ? {
                  ...order.rider,
                  kyc_status: kycStatus,
                  status: riders[index].status,
                }
              : null,
          }
        : order,
    );
    return clone(riders[index]);
  },
};

export const mockAreaCitiesDb = {
  fetchAll: async (): Promise<AreaCity[]> => {
    await delay();
    return clone(areaCities);
  },
  create: async (payload: AreaCityPayload): Promise<AreaCity> => {
    await delay();
    const record: AreaCity = {
      id: idWithPrefix("ac"),
      city: payload.city,
      area: payload.area,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    areaCities = [record, ...areaCities];
    return clone(record);
  },
  setActive: async (id: string, isActive: boolean): Promise<AreaCity> => {
    await delay();
    const index = areaCities.findIndex((record) => record.id === id);
    if (index < 0) {
      throw new Error("Area/City record not found");
    }
    areaCities[index] = { ...areaCities[index], is_active: isActive };
    return clone(areaCities[index]);
  },
};
