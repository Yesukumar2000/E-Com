export const baseUrl = `http://localhost:5000/api`;

export const imageBaseUrl = `http://localhost:5000`; // Image base url

// Don't change the below urls unless you know what you are doing

//Area API endpoints
export const areaCreateApi = `${baseUrl}/area/create`;
export const areaUpdateApi = `${baseUrl}/area/update`; // Update area api /${area._id}
export const areaGetApi = `${baseUrl}/area/all`;
export const areaDeleteApi = `${baseUrl}/area/delete`; // Delete area api /${area._id}

//Category API endpoints
export const categoryCreateApi = `${baseUrl}/category/create`;
export const categoryUpdateApi = `${baseUrl}/category/update`; // Update category api /${category._id}
export const categoryGetApi = `${baseUrl}/categories/all`;
export const categoryDeleteApi = `${baseUrl}/category/delete`; // Delete Category api /${category._id}

//SubCategory API endpoints
export const subCategoryCreateApi = `${baseUrl}/subcategory/create`;
export const subCategoryUpdateApi = `${baseUrl}/subcategory/update`; // Update subcategory api /${subCategory._id}
export const subCategoryGetApi = `${baseUrl}/subcategories/all`;
export const subCategoryDeleteApi = `${baseUrl}/subcategory/delete`; // Delete subcategory api /${id}

//Customer API endpoints
export const customerCreateApi = `${baseUrl}/customer/create`;
export const customerUpdateApi = `${baseUrl}/customer/update`; // Update customer api /${customer._id}
export const customerGetApi = `${baseUrl}/customer/all`;
export const customerDeleteApi = `${baseUrl}/customer/delete`; // Delete customer api /${customer._id}

//Tickets API endpoints
export const ticketCreateApi = `${baseUrl}/ticket/create`; //Usefull frontend side api
export const ticketUpdateStatusApi = `${baseUrl}/ticket/updateStatus`; // Update ticket status api /${ticket._id}
export const ticketGetApi = `${baseUrl}/tickets/all`;
export const ticketDeleteApi = `${baseUrl}/ticket/delete`; // Delete ticket api /${ticket._id}
export const ticketSendmgsApi = `${baseUrl}/ticket`; // Ticket message api /${ticket._id}/message
export const ticketCloseApi = `${baseUrl}/ticket/close`; // Ticket close api /${ticket._id}/close

//User API endpoints
export const userCreateApi = `${baseUrl}/user/create`;
export const userUpdateApi = `${baseUrl}/user/update`; // Update user api /${user._id}
export const userGetApi = `${baseUrl}/users/all`;
export const userDeleteApi = `${baseUrl}/user/delete`; // Delete user api /${user._id}

// Permissions API endpoints
export const permissionCreateApi = `${baseUrl}/permission/create`;
export const permissionUpdateApi = `${baseUrl}/permission/update`; // Update permission api /${permission._id}
export const permissionGetApi = `${baseUrl}/permissions/all`;
export const permissionDeleteApi = `${baseUrl}/permission/delete`; // Delete permission api /${permission._id}

// Roles API endpoints
export const roleCreateApi = `${baseUrl}/role/create`;
export const roleUpdateApi = `${baseUrl}/role/update`; // Update role api /${role._id}
export const roleGetApi = `${baseUrl}/roles/all`;
export const roleDeleteApi = `${baseUrl}/role/delete`; // Delete role api /${role._id}

// Banners API endpoints
export const bannerCreateApi = `${baseUrl}/banner/create`;
export const bannerUpdateApi = `${baseUrl}/banner/update`; // Update banner api /${banner._id}
export const bannerGetApi = `${baseUrl}/banners/all`;
export const bannerDeleteApi = `${baseUrl}/banner/delete`; // Delete banner api /${banner._id}

// promcode API endpoints
export const promocodeCreateApi = `${baseUrl}/promocode/create`;
export const promocodeUpdateApi = `${baseUrl}/promocode/update`; // Update promocode api /${promocode._id}
export const promocodeGetApi = `${baseUrl}/promocodes/all`;
export const promocodeDeleteApi = `${baseUrl}/promocode/delete`; // Delete promocode api /${promocode._id}

// settings API endpoints
export const generalCreateApi = `${baseUrl}/general/create`;
export const generalGetApi = `${baseUrl}/general`;
export const generalUpdateApi = `${baseUrl}/general/update`; // Update general api /${general._id}

// companyDetails Api endpoints
export const companyDetailsCreateApi = `${baseUrl}/companydetails/create`;
export const companyDetailsGetApi = `${baseUrl}/companydetails/all`;
export const companyDetailsUpdateApi = `${baseUrl}/companydetails/update`; // Update companydetails api /${companydetails._id}

// Meta content api endpoints
export const metaCreateApi = `${baseUrl}/meta/create`;
export const metaGetApi = `${baseUrl}/meta/all`;
export const metaUpdateApi = `${baseUrl}/meta/update`; // Update metacontent api /${metacontent._id}

// about us api endpoints
export const aboutCreateApi = `${baseUrl}/about/create`;
export const aboutGetApi = `${baseUrl}/about/all`;
export const aboutUpdateApi = `${baseUrl}/about/update`; // Update about api /${about._id}

//contact us api endpoints
export const contactCreateApi = `${baseUrl}/contact/create`;
export const contactGetApi = `${baseUrl}/contact/all`;
export const contactUpdateApi = `${baseUrl}/contact/update`; // Update contact api /${contact._id}

// policy api endpoints
export const policyCreateApi = `${baseUrl}/policy/create`;
export const policyGetApi = `${baseUrl}/policy/all`;
export const policyUpdateApi = `${baseUrl}/policy/update`; // Update policy api /${policy._id}

// product-type api endpoints
export const productTypeCreateApi = `${baseUrl}/product-type/create`;
export const productTypeUpdateApi = `${baseUrl}/product-type/update`; // Append /:id for updates
export const productTypeGetApi = `${baseUrl}/product-types/all`;
// export const productTypeDeleteApi = `${baseUrl}/product-type/delete`;

// cost api endpoints
export const costCreateApi = `${baseUrl}/cost/create`;
export const costGetApi = `${baseUrl}/costs/all`;
export const costUpdateApi = `${baseUrl}/cost/update`;
export const costDeleteApi = `${baseUrl}/cost/delete`;

// product api endpoints
export const productCreateApi = `${baseUrl}/product/create`;
export const productUpdateApi = `${baseUrl}/product/update`;
export const productGetApi = `${baseUrl}/products/all`;
export const productDeleteApi = `${baseUrl}/product/delete`;
