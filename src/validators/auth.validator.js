export function validateAuthPayload(req, res, next) {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || email.trim().length === 0) {
    return res.status(400).json({ error: { message: "email is required" } });
  }

  if (typeof password !== "string" || password.trim().length === 0) {
    return res.status(400).json({ error: { message: "password is required" } });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: { message: "email must be a valid email address" } });
  }

  return next();
}


export function PasswordValidator(password){
    
    if (typeof password !== "string"){
        return {isValid: false, reason: "Type Error: password must be a string"}
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialFigure = /[\W_]/.test(password);

    if(password.length < 8 || password.length > 25){
        return {isValid: false, reason:"Length Error: must be between 8 and 25 characters"}
    }

    if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialFigure){
        return {isValid: false, reason:"Complexity Error: Missing required fields"}
    }

    return {isValid: true, reason:"Password is Valid"};
}