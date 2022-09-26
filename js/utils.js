const $app = document.getElementById("app");

const asyncFetch = async (...args) => {
  try {
    const response = await fetch(...args);
    return await response.json();
  } catch (e) {
    throw Error("데이터를 불러오는데 실패하였습니다.");
  }
};
export { $app, asyncFetch };
