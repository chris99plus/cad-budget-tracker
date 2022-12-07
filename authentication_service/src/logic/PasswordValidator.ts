
export function isPasswordValid(password: string): boolean {
    let longEnough = password.length > 8;

    // TODO: Implement more password rules

    return longEnough;
}
