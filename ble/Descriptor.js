import { Descriptor as __Descriptor } from 'bleno';

class Descriptor extends __Descriptor {
    constructor(uuid, value) {
        super({
            uuid: uuid,
            value: value
        });
    }
    toString() {
        return "Descriptor: uuid = " + this.uuid + " value = " + this.value;
    }
}
const _Descriptor = Descriptor;
export { _Descriptor as Descriptor };
