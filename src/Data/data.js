const getQuestions = async () => {
  const response = await fetch("https://opentdb.com/api.php?amount=15");
  const data = await response.json();
  return data.results; // 👈 مهم بزاف
};

export default getQuestions;