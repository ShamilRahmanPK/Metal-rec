import commonAPI from "./commonAPI";
import SERVER_BASE_URL from "./serverURL";

// save purity
export const  savePurity = async (reqBody)=>{
    return await commonAPI("POST",`${SERVER_BASE_URL}/save-purity`,reqBody)
}

export const getAllPuritiesApi = async () => {
    return await commonAPI("GET", `${SERVER_BASE_URL}/get-all-purities`);
}

export const deletePurityApi = async (id) => {
  return await commonAPI("DELETE", `${SERVER_BASE_URL}/delete-purity/${id}`);
};

// get puritybymetal
export const getPuritiesByMetalApi = async (metalname) => {
  return await commonAPI("GET", `${SERVER_BASE_URL}/get-purities/${metalname}`);
};

// save metal price
export const saveMetalRateApi = async (reqBody) => {
  return await commonAPI("POST", `${SERVER_BASE_URL}/save-metal-price`, reqBody);
};

export const getAllMetalRatesApi = async (params) => {
  const query = new URLSearchParams(params).toString();
  return await commonAPI("GET", `${SERVER_BASE_URL}/get-all-metal-prices?${query}`);
};
