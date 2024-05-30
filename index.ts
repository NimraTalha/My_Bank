
import { faker } from "@faker-js/faker";
import inquirer from "inquirer";

// Customer class
class Customer {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    mobNumber: number;
    account: number;
    constructor(fName: string, lName: string, gen: string, age: number, mobile: number, acc: number) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gen;
        this.mobNumber = mobile;
        this.account = acc;
    }
}

// Interface BankAccount
interface BankAccount {
    accNumber: number;
    balance: number;
}

// Bank class
class Bank {
    customer: Customer[] = [];
    account: BankAccount[] = [];
    addCustomer(obj: Customer) {
        this.customer.push(obj);
    }
    addAccountNumber(obj: BankAccount) {
        this.account.push(obj);
    }

    // Find account by account number
    findAccount(accNumber: number): BankAccount | undefined {
        return this.account.find(account => account.accNumber === accNumber);
    }

    // View balance
    viewBalance(accNumber: number): string {
        const account = this.findAccount(accNumber);
        return account ? `The balance for account ${accNumber} is $${account.balance}` : `Account ${accNumber} not found.`;
    }

    // Withdraw cash
    withdrawCash(accNumber: number, amount: number): string {
        const account = this.findAccount(accNumber);
        if (account) {
            if (account.balance >= amount) {
                account.balance -= amount;
                return `Withdrawal of $${amount} successful. New balance is $${account.balance}.`;
            } else {
                return `Insufficient funds. Current balance is $${account.balance}.`;
            }
        } else {
            return `Account ${accNumber} not found.`;
        }
    }

    // Deposit cash
    depositCash(accNumber: number, amount: number): string {
        const account = this.findAccount(accNumber);
        if (account) {
            account.balance += amount;
            return `Deposit of $${amount} successful. New balance is $${account.balance}.`;
        } else {
            return `Account ${accNumber} not found.`;
        }
    }

    // View customer details
    viewCustomerDetails(): void {
        console.log("Customer Details:");
        this.customer.forEach((customer, index) => {
            console.log(`${index + 1}. Name: ${customer.firstName} ${customer.lastName}, Age: ${customer.age}, Gender: ${customer.gender}, Mobile: ${customer.mobNumber}, Account Number: ${customer.account}`);
        });
    }
}

let tkBank = new Bank();

// Create customers and accounts
for (let i: number = 1; i <= 7; i++) {
    let fName = faker.person.firstName('male');
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number('##########')); // Generate a 10-digit random phone number

    const cus = new Customer(fName, lName, "Male", 20 * i, num, 1000 + i);
    tkBank.addCustomer(cus);
    tkBank.addAccountNumber({
        accNumber: 1000 + i,
        balance: 100 * i
    });
}

// Bank functionality
async function bankService(bank: Bank) {
    while (true) {
        let { select } = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please select the Service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "View Customer Details", "Exit"]
        });

        if (select === "Exit") {
            console.log("Thank you for using our services. Goodbye!");
            break;
        }

        if (select === "View Customer Details") {
            bank.viewCustomerDetails();
            continue;
        }

        let { accNumber } = await inquirer.prompt({
            type: "input",
            name: "accNumber",
            message: "Please enter your account number:",
            validate: (input) => {
                return !isNaN(input) ? true : "Please enter a valid number.";
            }
        });

        accNumber = parseInt(accNumber);

        if (select === "View Balance") {
            console.log(bank.viewBalance(accNumber));
        } else if (select === "Cash Withdraw") {
            let { amount } = await inquirer.prompt({
                type: "input",
                name: "amount",
                message: "Please enter the amount to withdraw:",
                validate: (input) => {
                    return !isNaN(input) && input > 0 ? true : "Please enter a valid amount.";
                }
            });
            amount = parseFloat(amount);
            console.log(bank.withdrawCash(accNumber, amount));
        } else if (select === "Cash Deposit") {
            let { amount } = await inquirer.prompt({
                type: "input",
                name: "amount",
                message: "Please enter the amount to deposit:",
                validate: (input) => {
                    return !isNaN(input) && input > 0 ? true : "Please enter a valid amount.";
                }
            });
            amount = parseFloat(amount);
            console.log(bank.depositCash(accNumber, amount));
        }
    }
}

bankService(tkBank);
