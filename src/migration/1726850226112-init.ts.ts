import { readdirSync, readFileSync } from "fs";
import { MigrationInterface, QueryRunner } from "typeorm";
import { AppDataSource } from "../data-source";
import { BankTransaction } from "../entity/BankTransaction";
import { join } from "path";

const sleep = async (ms: number) => {
  return await new Promise((resolve) => setTimeout(resolve, ms));
};

export class InitTs1726850226112 implements MigrationInterface {
  public async up(): Promise<void> {
    const bankTransaction = AppDataSource.getRepository(BankTransaction)
    let path = __dirname.split("\\");
    path = path?.slice(0, path?.length - 1);
    const pathStore = join(...path, "Store");
    const listDir = readdirSync(pathStore);
    for (const dir of listDir) {
      const pathDir = join(pathStore, dir);
      const listFile = readdirSync(join(pathStore, dir));
      for (const file of listFile) {
        const dataFile = JSON.parse(
          readFileSync(join(pathDir, file), {
            encoding: "utf8",
          })
        );
        await bankTransaction.insert(dataFile)
        sleep(500);
      }
    }
  }

  public async down(): Promise<void> {}
}
