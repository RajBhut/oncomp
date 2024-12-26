const url = "http://localhost:3000/";
const payload = {
  code: "c3VtID0wIApmb3IgaSBpbiByYW5nZSgxMDAwMDAwKToKICAgIHN1bSA9IHN1bStpCnByaW50KHN1bSk=",
};
const headers = {
  "Content-Type": "application/json",
};
const sr = async () => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    console.log("res", res.json());
  } catch (err) {
    console.log(err);
  }
};

const simlate = async (count) => {
  const req = Array(count)
    .fill(null)
    .map(() => sr());
  await Promise.all(req);
  console.log(`${count} request complited`);
};
simlate(50);
