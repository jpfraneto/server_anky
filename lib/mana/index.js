async function addManaToUser(user, manaToAdd) {
  console.log(
    `Inside the add mana to user function. Add ${manaToAdd} points to ${user}`
  );
  return { message: "success" };
}

module.exports = { addManaToUser };
