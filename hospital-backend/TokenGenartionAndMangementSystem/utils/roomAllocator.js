async function getNextRoom(db,department_id)
{
    const res=await db.query('SELECT id FROM rooms WHERE department_id=$1',[department_id])
    const rooms=res.rows;

    if (rooms.length===0) throw new Error('No rooms available for depratment');

    const lastRoomsRes=await db.query('SELECT room_id FROM tokens WHERE department_id=$1 ORDER BY id DESC LIMIT 1',[department_id])
    const lastRoomId=lastRoomsRes.rows[0]?.room_id;

    if(!lastRoomId)
        return rooms[0].id;
    const lastIndex=rooms.findIndex((r)=>r.id==lastRoomId)
    const nextIndex=(lastIndex+1)%rooms.length

    return rooms[nextIndex].id

}
module.exports=getNextRoom