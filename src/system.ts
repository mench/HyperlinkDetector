import {
    inject,
    singleton,
    container
} from 'dependency-injection.ts';
import {View} from "./components/view";

@singleton
export class System {

    public static get app():System{
        return <System>Object.defineProperty(this,'app',{
            value:container
                .getInstanceOf(System)
        }).app;
    }
    @inject
    public view:View;
    public start(){
        this.view.render();
    }
}
System.app.start();