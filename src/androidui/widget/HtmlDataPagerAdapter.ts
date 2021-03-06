/**
 * Created by linfaxin on 15/11/16.
 */

///<reference path="../../android/database/DataSetObservable.ts"/>
///<reference path="../../android/database/Observable.ts"/>
///<reference path="../../android/database/DataSetObserver.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/support/v4/view/ViewPager.ts"/>
///<reference path="../../android/support/v4/view/PagerAdapter.ts"/>
///<reference path="../../android/content/Context.ts"/>

module androidui.widget{

    import Observable = android.database.Observable;
    import DataSetObservable = android.database.DataSetObservable;
    import DataSetObserver = android.database.DataSetObserver;
    import ViewGroup = android.view.ViewGroup;
    import View = android.view.View;
    import ViewPager = android.support.v4.view.ViewPager;
    import PagerAdapter = android.support.v4.view.PagerAdapter;
    import Context = android.content.Context;

    export class HtmlDataPagerAdapter extends PagerAdapter implements HtmlDataAdapter{
        static RefElementTag = "ref-element".toUpperCase();
        static RefElementProperty = "RefElement";
        static BindAdapterProperty = "BindAdapter";
        bindElementData:HTMLElement;
        mContext:Context;

        onInflateAdapter(bindElement:HTMLElement, context?:Context, parent?:android.view.ViewGroup):void {
            this.bindElementData = bindElement;
            this.mContext = context;
            if(parent instanceof ViewPager){
                parent.setAdapter(this);
            }
            bindElement[HtmlDataPagerAdapter.BindAdapterProperty] = this;
            this.registerHtmlDataObserver();
        }

        private registerHtmlDataObserver(){
            const adapter = this;
            function callBack(arr: MutationRecord[], observer: MutationObserver){
                adapter.notifyDataSetChanged();
            }
            let observer:MutationObserver = new MutationObserver(callBack);
            observer.observe(this.bindElementData, {childList:true});
        }


        getCount():number {
            return this.bindElementData.children.length;
        }

        instantiateItem(container:android.view.ViewGroup, position:number):any {
            let element = this.getItem(position);
            let view:View = element[View.AndroidViewProperty];
            this.checkReplaceWithRef(element);
            if(!view){
                view = View.inflate(this.mContext, <HTMLElement>element);
                element[View.AndroidViewProperty] = view;
            }
            container.addView(view);
            return view;
        }

        getItem(position:number):Element{
            let element = this.bindElementData.children[position];
            if(element.tagName === HtmlDataPagerAdapter.RefElementTag){
                element = element[HtmlDataPagerAdapter.RefElementProperty];
                if(!element) throw Error('Reference element is '+element);
            }
            return element;
        }

        /**
         * create a ref element replace the element
         * @param element
         * @return ref element
         */
        private checkReplaceWithRef(element):HTMLElement {
            let refElement = element[HtmlDataPagerAdapter.RefElementProperty] || document.createElement(HtmlDataPagerAdapter.RefElementTag);
            refElement[HtmlDataPagerAdapter.RefElementProperty] = element;
            element[HtmlDataPagerAdapter.RefElementProperty] = refElement;
            if(element.parentNode === this.bindElementData) {
                this.bindElementData.insertBefore(refElement, element);
                this.bindElementData.removeChild(element);
            }
            return refElement;
        }

        private removeElementRefAndRestoreToAdapter(childElement:Element){
            if(childElement.tagName === HtmlDataPagerAdapter.RefElementTag){
                let element = childElement[HtmlDataPagerAdapter.RefElementProperty];
                this.bindElementData.insertBefore(element, childElement);
                this.bindElementData.removeChild(childElement);
            }
        }

        /**
         * restore real element to ref element, so the bindElement's children was origin children
         */
        notifyDataSizeWillChange(){
            for(let i = 0, count=this.bindElementData.children.length; i<count; i++){
                this.removeElementRefAndRestoreToAdapter(this.bindElementData.children[i]);
            }
            this.notifyDataSetChanged();
        }

        destroyItem(container:android.view.ViewGroup, position:number, object:any):void {
            let view = <View>object;
            container.removeView(view);
        }

        isViewFromObject(view:android.view.View, object:any):boolean {
            return view === object;
        }

        getItemPosition(object:any):number {
            let position = PagerAdapter.POSITION_NONE;
            if(object==null) return position;
            for(let i=0, count = this.getCount(); i<count; i++){
                if(object === this.getItem(i)[View.AndroidViewProperty]){
                    position = i;
                    break;
                }
            }
            return position;
        }
    }
}