/**
 * Created by linfaxin on 15/11/3.
 */
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/util/StateSet.ts"/>

module androidui.attr{
    export class StateAttr{
        private stateSpec:number[];
        private attributes = new Map<string,string>();

        constructor(state:number[]) {
            this.stateSpec = state.sort();
        }

        setAttr(name:string, value:string){
            this.attributes.set(name, value);
        }

        hasAttr(name:string){
            return this.attributes.has(name);
        }

        getAttrMap():Map<string, string>{
            return this.attributes;
        }

        putAll(stateAttr:StateAttr){
            for(let [key, value] of stateAttr.attributes.entries()){
                this.attributes.set(key, value);
            }
        }

        isStateEquals(state:number[]):boolean{
            if(!state) return false;
            return this.stateSpec+'' === state.sort()+'';
        }
        isStateMatch(state:number[]):boolean{
            return android.util.StateSet.stateSetMatches(this.stateSpec, state);
        }


        mergeRemovedFrom(another:StateAttr):Map<string,string>{
            if(!another) return this.attributes;
            let removed = new Map<string, string>(another.attributes);
            for(let key of this.attributes.keys()) removed.delete(key);

            let merge = new Map<string, string>(this.attributes);
            for(let key of removed.keys()) merge.set(key, <string>null);

            return merge;
        }

        static parseStateAttrName(stateDesc):Set<number>{
            //attr with state
            if(stateDesc.startsWith('android:')) stateDesc = stateDesc.substring('android:'.length);
            if(stateDesc.startsWith('state_')) stateDesc = stateDesc.substring('state_'.length);
            let stateSet = new Set<number>();
            let stateParts = stateDesc.split('&');

            for(let part of stateParts){
                let sign = 1;
                while(part.startsWith('!')){
                    sign *= -1;
                    part = part.substring(1);
                }
                let stateValue = android.view.View['VIEW_STATE_' + part.toUpperCase()];
                if(stateValue!==undefined){
                    stateSet.add(stateValue * sign);
                }
            }

            return stateSet;
        }

    }
}