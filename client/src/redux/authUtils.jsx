export const getToken = () => {
  // Retrieve userInfo object from local storage
  const restaurantInfoString = localStorage.getItem('restaurantInfo');
  // Parse userInfo object
  if (restaurantInfoString) {
    const restaurantInfo = JSON.parse(restaurantInfoString);
    console.log(restaurantInfo.token);
    return restaurantInfo.token;
  }
  const userInfoString = localStorage.getItem('userInfo');
  if (userInfoString) {
    const userInfo = JSON.parse(userInfoString);
    console.log(userInfo.token);
    return userInfo.token;
  }

  return null;
};