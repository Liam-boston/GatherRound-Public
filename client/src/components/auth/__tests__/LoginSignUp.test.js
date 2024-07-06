import { render, cleanup } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach } from "@jest/globals";
import LoginSignup from "../LoginSignup";

let user;
let singUpSwitch;
let signUpElement;
let signUpName;
let signUpEmail;
let signUpPassword;
let signupPasswordVerification;
let signUpSubmit;
let signUpEmailError;
let signUpPasswordError;
let signupPasswordVerificationMessage;

let logInElement;
let logInEmail;
let logInPassword;

describe('Login', () => {
    beforeEach(() => {
        user = userEvent.setup();
        const { getByTestId } = render(<LoginSignup/>);
        logInElement = getByTestId('login-el');
        logInEmail = getByTestId('login-email');
        logInPassword = getByTestId('login-password');
    });

    afterEach(() => {
        cleanup();
    });

    //UT-7: Able to fill out login
    test('should accept input', async () => {
        jest.setTimeout(8000);

        expect(logInElement).toBeInTheDocument();

        await user.type(logInEmail, 'test@mail.com');
        expect(logInEmail.value).toBe('test@mail.com'); 

        await user.type(logInPassword, 'Abcdefgh123!');
        expect(logInPassword.value).toBe('Abcdefgh123!'); 
    });
});

describe('Signup', () => {

    beforeEach(() => {
        user = userEvent.setup();
        const { getByTestId } = render(<LoginSignup/>);
        singUpSwitch = getByTestId('signup-switch');
        user.click(singUpSwitch);
        signUpElement = getByTestId('signup-el');
        signUpName = getByTestId('signup-name');
        signUpEmail = getByTestId('signup-email');
        signUpPassword = getByTestId('signup-password');
        signupPasswordVerification = getByTestId('signup-password-verification');
        signUpSubmit = getByTestId('signup-submit');
        signUpEmailError = getByTestId('signup-email-error');
        signUpPasswordError = getByTestId('signup-password-error');
        signupPasswordVerificationMessage = getByTestId('signup-password-verification-message');
    
    });

    afterEach(() => {
        cleanup()
    });

    // UT-1: Able to sign up
    // TO-DO: Fix timeout issue
    test('should sign up', async () => {
        jest.setTimeout(8000);

        expect(signUpElement).toBeInTheDocument();

        await user.type(signUpName, 'John Smith');
        expect(signUpName.value).toBe('John Smith');

        await user.type(signUpEmail, 'test@mail.com');
        expect(signUpEmail.value).toBe('test@mail.com'); 

        await user.type(signUpPassword, 'Abcdefgh123!');   
        expect(signUpPassword.value).toBe('Abcdefgh123!');

        await user.type(signupPasswordVerification, 'Abcdefgh123!');   
        expect(signupPasswordVerification.value).toBe('Abcdefgh123!');
        
        expect(signUpSubmit.disabled).toBe(false);

    });

    // UT-2: Unable to sign up with invalid email
    test('should alert invalid email', async () => {  
        jest.setTimeout(8000);

        expect(signUpElement).toBeInTheDocument();

        await user.type(signUpName, 'John Smith');
        expect(signUpName.value).toBe('John Smith');
        
        await user.type(signUpEmail, 'testmail.com');
        expect(signUpEmail.value).toBe('testmail.com'); 
        expect(signUpEmailError.textContent).toBe('Email is Not Valid');

        await user.type(signUpPassword, 'Abcdefgh123!');
        expect(signUpPassword.value).toBe('Abcdefgh123!');

        await user.type(signupPasswordVerification, 'Abcdefgh123!');   
        expect(signupPasswordVerification.value).toBe('Abcdefgh123!');

        expect(signUpSubmit.disabled).toBe(true);;
    });

    // UT-4.1: Unable to sign up with existing user email (too short)
    test('should alert invalid  password (too short)', async () => { 
        jest.setTimeout(8000);
        
        expect(signUpElement).toBeInTheDocument();
        
        await user.type(signUpName, 'John Smith');
        expect(signUpName.value).toBe('John Smith');

        await user.type(signUpEmail, 'test@mail.com');
        expect(signUpEmail.value).toBe('test@mail.com'); 

        await user.type(signUpPassword, 'Abc123!');
        expect(signUpPassword.value).toBe('Abc123!');
        expect(signUpPasswordError.textContent).toBe('Password is Not Valid');

        await user.type(signupPasswordVerification, 'Abc123!');
        expect(signupPasswordVerification.value).toBe('Abc123!');

        expect(signUpSubmit.disabled).toBe(true);
    });

    // UT-4.2: Unable to sign up with existing user email (too long)
    test('should alert invalid  password (too long)', async () => { 
        jest.setTimeout(8000);
        
        expect(signUpElement).toBeInTheDocument();
        
        await user.type(signUpName, 'John Smith');
        expect(signUpName.value).toBe('John Smith');

        await user.type(signUpEmail, 'test@mail.com');
        expect(signUpEmail.value).toBe('test@mail.com'); 

        await user.type(signUpPassword, 'Abcdefghijlkm123!');
        expect(signUpPassword.value).toBe('Abcdefghijlkm123!');
        expect(signUpPasswordError.textContent).toBe('Password is Not Valid');

        await user.type(signupPasswordVerification, 'Abcdefghijlkm123!');
        expect(signupPasswordVerification.value).toBe('Abcdefghijlkm123!');

        expect(signUpSubmit.disabled).toBe(true);
    });

    // UT-4.3: Unable to sign up with existing user email (no special character)
    test('should alert invalid  password (no special character)', async () => { 
        jest.setTimeout(8000);
        
        expect(signUpElement).toBeInTheDocument();
        
        await user.type(signUpName, 'John Smith');
        expect(signUpName.value).toBe('John Smith');

        await user.type(signUpEmail, 'test@mail.com');
        expect(signUpEmail.value).toBe('test@mail.com'); 

        await user.type(signUpPassword, 'Abcdefgh123');
        expect(signUpPassword.value).toBe('Abcdefgh123');
        expect(signUpPasswordError.textContent).toBe('Password is Not Valid');

        await user.type(signupPasswordVerification, 'Abcdefgh123');
        expect(signupPasswordVerification.value).toBe('Abcdefgh123');

        expect(signUpSubmit.disabled).toBe(true);
    });

    // UT-4.4: Unable to sign up with existing user email (no capital letter)
    test('should alert invalid  password (no capital letter)', async () => { 
        jest.setTimeout(8000);
        
        expect(signUpElement).toBeInTheDocument();
        
        await user.type(signUpName, 'John Smith');
        expect(signUpName.value).toBe('John Smith');

        await user.type(signUpEmail, 'test@mail.com');
        expect(signUpEmail.value).toBe('test@mail.com'); 

        await user.type(signUpPassword, 'abcdefgh123!');
        expect(signUpPassword.value).toBe('abcdefgh123!');
        expect(signUpPasswordError.textContent).toBe('Password is Not Valid');

        await user.type(signupPasswordVerification, 'abcdefgh123!');
        expect(signupPasswordVerification.value).toBe('abcdefgh123!');

        expect(signUpSubmit.disabled).toBe(true);
    });
    
    // UT-4.5: Unable to sign up with existing user email (no lowercase letter)
    test('should alert invalid  password (no lowercase letter)', async () => { 
        jest.setTimeout(8000);
        
        expect(signUpElement).toBeInTheDocument();
        
        await user.type(signUpName, 'John Smith');
        expect(signUpName.value).toBe('John Smith');

        await user.type(signUpEmail, 'test@mail.com');
        expect(signUpEmail.value).toBe('test@mail.com'); 

        await user.type(signUpPassword, 'ABCDEFGH123!');
        expect(signUpPassword.value).toBe('ABCDEFGH123!');
        expect(signUpPasswordError.textContent).toBe('Password is Not Valid');

        await user.type(signupPasswordVerification, 'ABCDEFGH123!');
        expect(signupPasswordVerification.value).toBe('ABCDEFGH123!');

        expect(signUpSubmit.disabled).toBe(true);
    });

    // UT-4.6: Unable to sign up with existing user email (no number)
    test('should alert invalid  password (no number)', async () => { 
        jest.setTimeout(8000);
        
        expect(signUpElement).toBeInTheDocument();
        
        await user.type(signUpName, 'John Smith');
        expect(signUpName.value).toBe('John Smith');

        await user.type(signUpEmail, 'test@mail.com');
        expect(signUpEmail.value).toBe('test@mail.com'); 

        await user.type(signUpPassword, 'ABCDEFGH!');
        expect(signUpPassword.value).toBe('ABCDEFGH!');
        expect(signUpPasswordError.textContent).toBe('Password is Not Valid');

        await user.type(signupPasswordVerification, 'ABCDEFGH!');
        expect(signupPasswordVerification.value).toBe('ABCDEFGH!');

        expect(signUpSubmit.disabled).toBe(true);
    });

    // UT-5: Unable to sign up with non-matching passwords
    test('should alert non-matching passwords', async () => {
        jest.setTimeout(8000);
        
        expect(signUpElement).toBeInTheDocument();
        
        await user.type(signUpName, 'John Smith');
        expect(signUpName.value).toBe('John Smith');

        await user.type(signUpEmail, 'test@mail.com');
        expect(signUpEmail.value).toBe('test@mail.com'); 

        await user.type(signUpPassword, 'Abcdefgh123!');   
        expect(signUpPassword.value).toBe('Abcdefgh123!');

        await user.type(signupPasswordVerification, 'Abcdefgh123?');  
        expect(signupPasswordVerification.value).toBe('Abcdefgh123?');
        expect(signupPasswordVerificationMessage.textContent).toBe('Passwords do not match');

        expect(signUpSubmit.disabled).toBe(true);
    });

});

// TODO: Address warning from lack of "act" method.
