import { Client } from "edgedb";
import { $expr_PathNode, objectTypeToSelectShape } from "../../generated/syntax/syntax";
import { computeSelectShapeResult, FilterSingleType, ManyCompleteProjections, ModelIdentityArray, ModelScope, ModelTypeSet, OneCompleteProjection } from "../types";
import e from '../../generated/syntax/';
import { $overload, Coerce, createTypedPartialHelper, HKOperation } from 'fulldry-utils';


interface $RenderFindAll extends HKOperation {
    new: (x: Coerce<this["_1"], $expr_PathNode>) => <const T extends Coerce<this["_1"], $expr_PathNode>>(x: T) => Promise<ManyCompleteProjections<T>>;
}

export class EntityManager<
    Models extends $expr_PathNode[],
> {
    constructor(
        private readonly client: Client,
    ) { }

    // @ts-expect-error
    findAll: $overload<Models, $RenderFindAll> = async <T>(model: T) => {
        return await
            e.select(model, (m: any) => ({
                ...m['*']
            }))
                .run(this.client);
    }
}


// Usage:
const client = {} as Client;
type ModelsTuple = [typeof e.Pet];

const entityManager = new EntityManager<ModelsTuple>(client);

const pets = entityManager.findAll(e.Pet); //const pets: Promise<{ id: string; name: string; age: number; }[]>

