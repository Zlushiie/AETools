module.exports = client => {
    try{
        client.user.setStatus(`online`);
        client.user.setActivity({
            name: `Coded by Zlushiie | You can DM me commands without a prefix!`,
            type: `WATCHING`
        });
    } catch (e){
        console.log(e.stack);
    }
}