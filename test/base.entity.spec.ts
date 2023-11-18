import { ObjectId } from "@mikro-orm/mongodb";
import { describe, expect, it } from "vitest";
import { BaseEntity } from "../src/common/base.entity";

class TestEntity extends BaseEntity<TestEntity> {
  constructor(entityData: any = null) {
    super();

    this.overwrite(entityData);
  }
}

describe("BaseEntity", () => {
  it("should correctly overwrite properties", () => {
    const baseEntity = new TestEntity();
    const objectId = new ObjectId();

    // Test with both _id and id provided
    baseEntity["overwrite"]({ _id: objectId, id: objectId.toString() });
    expect(baseEntity._id).toEqual(objectId);
    expect(baseEntity.id).toEqual(objectId.toString());

    // Test with only _id provided
    baseEntity["overwrite"]({ _id: objectId });
    expect(baseEntity.id).toEqual(objectId.toString());

    // Test with only id provided
    baseEntity["overwrite"]({ id: objectId.toString() });
    expect(baseEntity._id).toEqual(objectId);

    // Test with mismatching _id and id
    expect(() =>
      baseEntity["overwrite"]({ _id: objectId, id: "different-id" }),
    ).toThrow('Provided id "different-id" does not match the ObjectId');
  });

  it("should handle null entityData", () => {
    const baseEntity = new TestEntity();
    baseEntity["overwrite"](null);
  });
});
