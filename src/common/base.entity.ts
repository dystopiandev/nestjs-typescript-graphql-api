import {
  BaseEntity as MikroOrmBaseEntity,
  EntityData,
  PrimaryKey,
  SerializedPrimaryKey,
} from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

export abstract class BaseEntity<
  T extends { _id: ObjectId },
  K extends keyof T = "_id",
> extends MikroOrmBaseEntity<T, K> {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  protected overwrite(
    entityData?: EntityData<T> & EntityData<BaseEntity<T, K>>,
  ) {
    if (!entityData) {
      return;
    }

    const objectId = entityData._id?.toString();

    if (entityData._id && entityData.id && entityData.id !== objectId) {
      throw new Error(
        `Provided id "${entityData.id}" does not match the ObjectId "${objectId}"`,
      );
    }

    if (entityData._id && !entityData.id) {
      entityData.id = objectId;
    }

    if (entityData.id && !entityData._id) {
      entityData._id = new ObjectId(entityData.id);
    }

    Object.assign(this, entityData);
  }
}
