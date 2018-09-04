import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  NotEmpty,
  BeforeCount
} from "sequelize-typescript";

@Table
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  first_name: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  last_name: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  location: string;

  @BeforeCount
  static setRaw(options: { raw: boolean }) {
    options.raw = true;
  }
}
