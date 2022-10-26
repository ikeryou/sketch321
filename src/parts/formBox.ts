import { Conf } from "../core/conf";
import { Func } from "../core/func";
import { MousePointer } from "../core/mousePointer";
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Point } from "../libs/point";
import { Update } from "../libs/update";
import { Util } from "../libs/util";
import { FormItem } from "./formItem";

// -----------------------------------------
//
// -----------------------------------------
export class FormBox extends MyDisplay {

  private _id:number
  private _con:HTMLElement;
  private _conRot:Point = new Point();
  private _item:Array<FormItem> = [];

  constructor(opt:any) {
    super(opt)

    this._id = opt.id;
    this._conRot.x = this._id * 5

    this._con = this.getEl();

    this.addClass('s-gpu');

    this.qsAll('.item').forEach((val) => {
      this._item.push(new FormItem({
        el:val,
      }));
    });

    this._resize();
  }

  protected _update(): void {
    super._update();

    const sw = Func.instance.sw();
    const sh = Func.instance.sh();

    const mx = MousePointer.instance.easeNormal.x;
    const my = MousePointer.instance.easeNormal.y;

    let itemWidth = Math.max(sw, sh) * Func.instance.val(0.3, 0.25);

    let h = Func.instance.val(0.1, 20);
    const totalH = h * Conf.instance.NUM;

    const y = sh * 0.5 + this._id * h - (totalH * 0.5) - h - h * 0.5;

    let dy = Math.abs(Util.instance.map(y, -1, 1, 0, sh) - my);
    dy = Math.pow(dy, 2);
    // itemWidth *= Util.instance.map(dy, 1, 0.1, 0, 0.5);
    // const speed = Util.instance.map(dy, 1.5, 1, 0, 0.5) * mx * 5;

    // const cx = itemWidth * 0.5;
    // const cy = itemWidth * 0.5;

    // const rate = Util.instance.map(Math.sin(Util.instance.radian(this._conRot.x * 2)), 0, 1, -1, 1);
    // const rate = Math.abs(mx) * 1;

    // const it = 1 / this._item.length
    this._item.forEach((val,i) => {
      const radian = Util.instance.radian((360 / this._item.length) * i);
      const x = 0 + Math.sin(radian) * itemWidth * 0.5;
      const z = Math.cos(radian) * itemWidth * 0.5;
      let rot = Util.instance.degree(Math.atan2(z, (x - 0))) + 90;

      Tween.instance.set(val.getEl(), {
        x:x + (dy * -0.1) * sw,
        z:z * -1,
        y:0,
        width: itemWidth,
        rotationY:rot,
      })

      if(Update.instance.cnt % 10 == 0) {
        val.setSize(itemWidth);
        // val.setRate(Util.instance.map(rate, 0, 1, it * i, it * i + it));
        // val.setRate(1);
      }

    });


    Tween.instance.set(this._con, {
      x: sw * 0.5,
      rotationY:this._conRot.x,
      // rotationX:this._conRot.x * 0.75,
      // width: itemWidth,
      // height: itemWidth,
      y:y,
    })
    // this._conRot.x += speed;
    this._conRot.x += Func.instance.val(1, 0) + mx * Func.instance.val(10, 5);
  }

  protected _resize(): void {
    super._resize();
  }
}