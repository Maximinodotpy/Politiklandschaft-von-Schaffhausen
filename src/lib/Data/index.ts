

interface Mandate {
    first_name: string,
    last_name: string,
    birthday: Date,
    party: string,
    fraction?: string,
    email: string,
}

interface Instance {
    name: string,
    type: 'legislativ' | 'executive',
    level: 'canton' | 'community',
    website: string,
}

interface Place {
    name: string,
    website: string,
}