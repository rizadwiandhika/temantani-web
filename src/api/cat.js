export const get = async () =>
  fetch("https://catfact.ninja/fact").then(
    (res) =>
      new Promise((acc, dec) =>
        setTimeout(() => {
          Math.random() > 0.5 ? acc(res.text()) : dec("intentionally error");
        }, 1500),
      ),
  );
