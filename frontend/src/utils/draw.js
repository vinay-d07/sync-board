export const draw = (ctx, { x, y }) => {
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
};