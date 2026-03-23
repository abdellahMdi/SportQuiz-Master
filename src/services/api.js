const API_URL = "https://opentdb.com/api.php";

export const decodeHtml = (value) => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(value, "text/html");
	return doc.documentElement.textContent || "";
};

export const shuffleArray = (items) => {
	const next = [...items];

	for (let index = next.length - 1; index > 0; index -= 1) {
		const swapWith = Math.floor(Math.random() * (index + 1));
		[next[index], next[swapWith]] = [next[swapWith], next[index]];
	}

	return next;
};

export const fetchQuestions = async ({ amount = 20, categoryId = 19 } = {}) => {
	const url = `${API_URL}?amount=${amount}&category=${categoryId}&type=multiple`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error("Failed to fetch questions");
	}

	const payload = await response.json();

	if (payload.response_code !== 0 || !Array.isArray(payload.results)) {
		throw new Error("No quiz questions available");
	}

	return payload.results.map((item) => {
		const correct = decodeHtml(item.correct_answer);
		const options = shuffleArray([
			correct,
			...item.incorrect_answers.map((answer) => decodeHtml(answer)),
		]);

		return {
			id: crypto.randomUUID(),
			category: decodeHtml(item.category),
			question: decodeHtml(item.question),
			correctAnswer: correct,
			options,
		};
	});
};
