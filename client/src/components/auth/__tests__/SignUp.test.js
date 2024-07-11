import { render, screen, cleanup } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach } from "@jest/globals";
import SignUp from "../SignUp";

let user;
let signUpElement;
let signUpName;
let signUpEmail;
let signUpPassword;
let signupPasswordVerification;
let signUpSubmit;
let signUpEmailError;
let signUpPasswordError;
let signupPasswordVerificationMessage;

beforeEach(() => {

    user = userEvent.setup();
    render(<SignUp/>);
    signUpElement = screen.getByTestId('signup-el');
    signUpName = screen.getByTestId('signup-name');
    signUpEmail = screen.getByTestId('signup-email');
    signUpPassword = screen.getByTestId('signup-password');
    signupPasswordVerification = screen.getByTestId('signup-password-verification');
    signUpSubmit = screen.getByTestId('signup-submit');
    signUpEmailError = screen.getByTestId('signup-email-error');
    signUpPasswordError = screen.getByTestId('signup-password-error');
    signupPasswordVerificationMessage = screen.getByTestId('signup-password-verification-message');

});

afterEach(() => {
    cleanup()
});

// UT-1
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

// UT-2
test('should alert invalid email', async () => {  
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

// UT-4.1: Too short
test('should alert invalid  password (too short)', async () => { 
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

// UT-4.2: Too long
test('should alert invalid  password (too long)', async () => { 
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

// UT-4.3: No special character
test('should alert invalid  password (no special character)', async () => { 
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

// UT-4.4: No capital letter
test('should alert invalid  password (no capital letter)', async () => { 
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
 
// UT-4.5: No lowercase letter
test('should alert invalid  password (no lowercase letter)', async () => { 
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

// UT-4.6: No number
test('should alert invalid  password (no number)', async () => { 
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

// UT-5
test('should alert non-matching passwords', async () => {
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