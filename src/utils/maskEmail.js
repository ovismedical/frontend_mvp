const maskEmail = (email) => {
  if (!email || !email.includes("@")) return "";

  const [local, domain] = email.split("@");
  const maskedLocal = local[0] + "***";

  const [domainName, domainExt] = domain.split(".");
  const maskedDomain = domainName[0] + "***";

  return `${maskedLocal}@${maskedDomain}.${domainExt}`;
};

export default maskEmail;
