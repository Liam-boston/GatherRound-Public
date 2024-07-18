import React, { act } from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { afterEach } from "@jest/globals";
import '@testing-library/jest-dom/extend-expect';
import LoginSignup from "../LoginSignup";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

jest.mock('firebase/auth', () => require('../../../../__mocks__/firebase'))

describe('Login', () => {

    afterEach(() => {
        cleanup();
    });

    //UT-7: Able to fill out login
    test('should log in', () => {
        const { getByTestId } = render(<LoginSignup/>);

        fireEvent.change(getByTestId('login-email'), {target: {value: 'test@mail.com'}});
        fireEvent.change(getByTestId('login-password'), {target: {value: 'Abcdefgh123!'}});

        fireEvent.click(getByTestId('login-submit'));

        expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    }, 8000);
});

describe('Signup', () => {

    afterEach(() => {
        cleanup()
        jest.clearAllMocks();
    });

    //UT-1: Able to sign up
    test('should sign up', () => {
        const { getByTestId } = render(<LoginSignup/>);

        fireEvent.click(getByTestId('signup-switch'));
        
        fireEvent.change(getByTestId('signup-name'), {target: {value: 'John Smith'}});
        fireEvent.change(getByTestId('signup-email'), {target: {value: 'test@mail.com'}});
        fireEvent.change(getByTestId('signup-password'), {target: {value: 'Abcdefgh123!'}});
        fireEvent.change(getByTestId('signup-password-verification'), {target: {value: 'Abcdefgh123!'}});
        
        fireEvent.click(getByTestId('signup-submit'));

        expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
    });

    // UT-2: Unable to sign up with invalid email
    test('should alert invalid email', () => { 
        const { getByTestId } = render(<LoginSignup/>);

        fireEvent.click(getByTestId('signup-switch'));
        
        fireEvent.change(getByTestId('signup-name'), {target: {value: 'John Smith'}});
        fireEvent.change(getByTestId('signup-email'), {target: {value: 'testmail.com'}});
        fireEvent.change(getByTestId('signup-password'), {target: {value: 'Abcdefgh123!'}});
        fireEvent.change(getByTestId('signup-password-verification'), {target: {value: 'Abcdefgh123!'}});
        
        fireEvent.click(getByTestId('signup-submit'));
        
        expect(getByTestId('signup-email-error').textContent).toBe('Email is Not Valid');
        expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(0);
    });

    // UT-4.1: Unable to sign up with invalid password (too short)
    test('should alert invalid password (too short)', () => { 
        const { getByTestId } = render(<LoginSignup/>);

        fireEvent.click(getByTestId('signup-switch'));
        
        fireEvent.change(getByTestId('signup-name'), {target: {value: 'John Smith'}});
        fireEvent.change(getByTestId('signup-email'), {target: {value: 'test@mail.com'}});
        fireEvent.change(getByTestId('signup-password'), {target: {value: 'Abc123!'}});
        fireEvent.change(getByTestId('signup-password-verification'), {target: {value: 'Abc123!'}});
        
        fireEvent.click(getByTestId('signup-submit'));

        expect(getByTestId('signup-password-error').textContent).toBe('Password is Not Valid');
        expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(0);
    });

    // UT-4.2: Unable to sign up with invalid password (too long)
    test('should alert invalid password (too long)',  () => { 
        const { getByTestId } = render(<LoginSignup/>);

        fireEvent.click(getByTestId('signup-switch'));
        
        fireEvent.change(getByTestId('signup-name'), {target: {value: 'John Smith'}});
        fireEvent.change(getByTestId('signup-email'), {target: {value: 'test@mail.com'}});
        fireEvent.change(getByTestId('signup-password'), {target: {value: 'Abcdefghijlkm123!'}});
        fireEvent.change(getByTestId('signup-password-verification'), {target: {value: 'Abcdefghijlkm123!'}});
        
        fireEvent.click(getByTestId('signup-submit'));

        expect(getByTestId('signup-password-error').textContent).toBe('Password is Not Valid');
        expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(0);
    });

     // UT-4.3: Unable to sign up with invalid password (no special character)
     test('should alert invalid password (no special character)', () => { 
        const { getByTestId } = render(<LoginSignup/>);

        fireEvent.click(getByTestId('signup-switch'));
        
        fireEvent.change(getByTestId('signup-name'), {target: {value: 'John Smith'}});
        fireEvent.change(getByTestId('signup-email'), {target: {value: 'test@mail.com'}});
        fireEvent.change(getByTestId('signup-password'), {target: {value: 'Abcdefgh123'}});
        fireEvent.change(getByTestId('signup-password-verification'), {target: {value: 'Abcdefgh123'}});
        
        fireEvent.click(getByTestId('signup-submit'));

        expect(getByTestId('signup-password-error').textContent).toBe('Password is Not Valid');
        expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(0);
    });

    // UT-4.4: Unable to sign up with invalid password (no capital letter)
    test('should alert invalid password (no capital letter)', () => { 
        const { getByTestId } = render(<LoginSignup/>);

        fireEvent.click(getByTestId('signup-switch'));
        
        fireEvent.change(getByTestId('signup-name'), {target: {value: 'John Smith'}});
        fireEvent.change(getByTestId('signup-email'), {target: {value: 'test@mail.com'}});
        fireEvent.change(getByTestId('signup-password'), {target: {value: 'abcdefgh123!'}});
        fireEvent.change(getByTestId('signup-password-verification'), {target: {value: 'abcdefgh123!'}});
        
        fireEvent.click(getByTestId('signup-submit'));

        expect(getByTestId('signup-password-error').textContent).toBe('Password is Not Valid');
        expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(0);
    });

    // UT-4.5: Unable to sign up with invalid password (no lowercase letter)
    test('should alert invalid password (no lowercase letter)', () => { 
        const { getByTestId } = render(<LoginSignup/>);

        fireEvent.click(getByTestId('signup-switch'));
        
        fireEvent.change(getByTestId('signup-name'), {target: {value: 'John Smith'}});
        fireEvent.change(getByTestId('signup-email'), {target: {value: 'test@mail.com'}});
        fireEvent.change(getByTestId('signup-password'), {target: {value: 'ABCDEFGH123!'}});
        fireEvent.change(getByTestId('signup-password-verification'), {target: {value: 'ABCDEFGH123!'}});
        
        fireEvent.click(getByTestId('signup-submit'));

        expect(getByTestId('signup-password-error').textContent).toBe('Password is Not Valid');
        expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(0);
    });

    // UT-4.6: Unable to sign up with invalid password (no number)
    test('should alert invalid password (no number)', () => { 
        const { getByTestId } = render(<LoginSignup/>);

        fireEvent.click(getByTestId('signup-switch'));
        
        fireEvent.change(getByTestId('signup-name'), {target: {value: 'John Smith'}});
        fireEvent.change(getByTestId('signup-email'), {target: {value: 'test@mail.com'}});
        fireEvent.change(getByTestId('signup-password'), {target: {value: 'Abcdefghijk!'}});
        fireEvent.change(getByTestId('signup-password-verification'), {target: {value: 'Abcdefghijk!'}});
        
        fireEvent.click(getByTestId('signup-submit'));

        expect(getByTestId('signup-password-error').textContent).toBe('Password is Not Valid');
        expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(0);
    });

    // UT-5: Unable to sign up with non-matching passwords
    test('should alert non-matching passwords', async () => {
        const { getByTestId } = render(<LoginSignup/>);

        fireEvent.click(getByTestId('signup-switch'));
        
        fireEvent.change(getByTestId('signup-name'), {target: {value: 'John Smith'}});
        fireEvent.change(getByTestId('signup-email'), {target: {value: 'test@mail.com'}});
        fireEvent.change(getByTestId('signup-password'), {target: {value: 'Abcdefgh123!'}});
        fireEvent.change(getByTestId('signup-password-verification'), {target: {value: 'Abcdefgh123?'}});
        
        fireEvent.click(getByTestId('signup-submit'));

        expect(getByTestId('signup-password-verification-message').textContent).toBe('Passwords do not match');
        expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(0);
    });

});