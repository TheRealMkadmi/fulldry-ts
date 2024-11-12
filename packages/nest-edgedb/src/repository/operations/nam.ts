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

    getRepository<M extends $expr_PathNode>(model: M): Repository<M> {
        // Create a proxy to bind the model parameter to the methods
        const handler: ProxyHandler<this> = {
            get(target, prop, receiver) {
                const origMethod = target[prop as keyof EntityManager<Models>];
                if (typeof origMethod === 'function') {
                    return origMethod.bind(target, model);
                }
                return origMethod;
            }
        };
        return new Proxy(this, handler) as Repository<M>;
    }
}

type Repository<M extends $expr_PathNode> = Omit<EntityManager<ModelsTuple>, 'findAll' | 'getRepository'> & {
    findAll: () => Promise<ManyCompleteProjections<M>>;
    // Add other methods here, omitting the model parameter
};


// Usage:
const client = {} as Client;
type ModelsTuple = [typeof e.Pet];

const entityManager = new EntityManager<ModelsTuple>(client);

const pets = entityManager.findAll(e.Pet); //const pets: Promise<{ id: string; name: string; age: number; }[]>


const r = entityManager.getRepository(e.Pet);

const ra = r.findAll(); 