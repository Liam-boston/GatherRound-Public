import { render, screen } from '@testing-library/react';
import { beforeEach } from '@jest/globals';
import UserProfileModal from '../UserProfileModal';

let modal;
let name;
let email;

beforeEach(() => {
    render(<UserProfileModal name='John Smith' email='test@mail.com'/>);
    modal = screen.getByTestId('modal');
    name = screen.getByTestId('name');
    email = screen.getByTestId('email');
});

test('should render modal', () => {
    expect(modal).toBeInTheDocument();
});

test('should render user data', () => {
    expect(name.textContent).toBe('John Smith');
    expect(email.textContent).toBe('test@mail.com');
});