import { AppDataSource } from "./data-source"
import { BankTransaction } from "./entity/BankTransaction"
import app from "./server"
const PORT = 3001

AppDataSource.initialize().then(async () => {
    const bankTransactonRepository = AppDataSource.manager.getRepository(BankTransaction)

    const bankTransaction = new BankTransaction();
    //   bankTransaction.accountNumber = "";
    //   bankTransaction.people = people || 1;
    //   bankTransaction.isPaid = isPaid ? 1 : 0;
    //   bankTransaction.user = user;
    bankTransactonRepository.save(bankTransaction)
    app.listen(PORT, () => console.log(`server lister port:${PORT} `))
}).catch(error => console.log(error))
