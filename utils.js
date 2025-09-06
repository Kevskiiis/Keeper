export function hasSpecialCharacters (string) {
    let specialCount = 0;
    for (let i = 0; i < string.length; ++i) {
        let ch = string.charCodeAt(i);

        if (
            !(ch >= 65 && ch <= 90) && // A-Z
            !(ch >= 97 && ch <= 122) && // a-z
            !(ch >= 48 && ch <= 57) // 0-9
        ) {
            specialCount++;
        }
    }
    return specialCount; 
}

export function hasNumber (string) {
    let numberCount = 0;

    for (let i = 0; i < string.length; ++i) {
        let ch = string.charCodeAt(i);

        if (ch >= 48 && ch <= 57) {
            numberCount ++;
        }
    }
    return numberCount;
}

export function hasLowerCase (string) {
    let lowercaseCount = 0;

    for (let i = 0; i < string.length; ++i) {
        let ch = string.charCodeAt(i);

        if (ch >= 97 && ch <= 122) {
            lowercaseCount++;
        }
    }
    return lowercaseCount;
}

export function hasUpperCase (string) {
    let uppercaseCount = 0;

    for (let i = 0; i < string.length; ++i) {
        let ch = string.charCodeAt(i);

        if (ch >= 65 && ch <= 90) {
            uppercaseCount++;
        }
    }
    return uppercaseCount;
}

// Verify Password:
export function passwordsMatch (password, retypedPassword) {
    if (password.trim() === retypedPassword.trim()) {
        return true;
    }
    else {
        return false; 
    }
}

// Empty entry: 
export function hasEmptyEntry(object) {
    const emptyFields = Object.keys(object).filter(key => 
        key !== 'middleName' && object[key].trim() === ''
    );
    return emptyFields.length > 0;
}

export function trimForm(object) {
    return Object.fromEntries(
        Object.entries(object).map(([key, value]) => [key, value.trim()])
    );
}

// Valid Form Registration:
export function isValidRegistration (form) {
    const {email, password, verifiedPassword, firstName, middleName, lastName} = form;

    // Process: Required sections must not be a space:
    const EmptyEntries = hasEmptyEntry(form);

    // Process: Passwords must match.
    const passwordMatch = passwordsMatch(password, verifiedPassword);

    // Process: Password must have special character, number, lowercase, and uppercase.
    const specialCharacters = hasSpecialCharacters(password);
    const numbersPresent = hasNumber(password);
    const lowerCaseLetters = hasLowerCase(password);
    const upperCaseLetters = hasUpperCase(password);

    if (
        !EmptyEntries &&
        passwordMatch &&
        specialCharacters >= 1 &&
        numbersPresent >= 1 &&
        lowerCaseLetters >= 1 &&
        upperCaseLetters >= 1
        ) {
        return true;
    }
    // Or else:
    return false; 
}

export function verifyNote (note) {
    const {title, content} = note; 
    return title.trim() !== "" && content.trim() !== "";
}