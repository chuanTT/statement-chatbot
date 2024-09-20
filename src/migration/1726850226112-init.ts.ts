import { readFileSync } from "fs";
import { MigrationInterface } from "typeorm";

export class InitTs1726850226112 implements MigrationInterface {
  public async up(): Promise<void> {
    const data = readFileSync("./src/Store/BIDV/01.09-12.09.2024.json");
  }

  public async down(): Promise<void> {}
}
