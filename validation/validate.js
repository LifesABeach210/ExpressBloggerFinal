let validateUserData = (userData) => {
  const checkEmail = userData.email;

  if (checkEmail !== undefined) {
    let count = 1;
    for (let i = 0; i < checkEmail.length; i++) {
   

      if (checkEmail[i] === "@") {
        count++;
      }
      if (count > 2) {
        return {
          isValid: false,
          message: "only one @ symbol in an email",
        };
      }
    }
  }

  if (userData.title === undefined || typeof userData.title !== "string") {
    return {
      isValid: false,
      message: "title must be a string and be defined",
    };
  }

  if (userData.text === undefined || typeof userData.text !== "string") {
    return {
      isValid: false,
      message: "text must be a string and have some chars in it ",
    };
  }
  if (userData.text.length > 40) {
    return {
      isValid: false,
      message: "Max of 40 chars",
    };
  }
  if (userData.author === undefined && typeof userData.author !== "string") {
    return {
      isValid: false,
      message:
        "Author must be a string and text can be no longer that 40 chars",
    };
  }

  console.log(userData.category + "userData");
  if (
    userData.category === undefined ||
    userData.category.length < 1 ||
    !Array.isArray(userData.category)
  ) {
    return {
      isValid: false,
      message: "Category must exist have at least 1 item and be An [Array]",
    };
  }
console.log(typeof(userData.starRating))
  if (
    typeof( userData.starRating) !== "Number"||
    userData.starRating > 10 ||
    userData.starRating < 1
  ) {
    return {
      isValid: false,
      message: "starRating must be a non negative number between 1 and 10",
    };
  }

  return {
    isValid: true,
  };

  // if (userData.favoriteFoods !== undefined && Array.isArray(userData.favoriteFoods) && userData.favoriteFoods.length > 0) {
  // 	// Array.isArray() will check to see if the variable is an array

  // 	let isFavoriteFoodsStrings = true;

  // 	for (let i = 0; i < userData.favoriteFoods.length; i++) {
  // 		if (typeof(userData.favoriteFoods[i]) !== 'string') {
  // 			isFavoriteFoodsStrings = false
  // 		}
  // 	}

  // 	if (isFavoriteFoodsStrings === false) {
  // 		return {
  // 			isValid: false
  // 		}
  // 	}
  // }
};

module.exports = {
  validateUserData,
};
