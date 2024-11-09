const isObject = (data: any) => {
  return data && typeof data === "object" && !Array.isArray(data);
};

const isArray = (data: any) => {
  return Array.isArray(data);
};

const sanitize = (data: any, omit: string[]) => {
  if (isObject(data)) {
    for (const key in data) {
      if (omit.includes(key)) {
        delete data[key];
      } else {
        if (isObject(data[key])) {
          sanitize(data[key], omit);
        } else if (isArray(data[key])) {
          data[key].forEach((data: any) => sanitize(data, omit));
        }
      }
    }
  }
};

export const sanitizeResponse = (data: any) => {
  const omit = ["_id", "password", "verification_code"];
  sanitize(data, omit);
  return data;
};
