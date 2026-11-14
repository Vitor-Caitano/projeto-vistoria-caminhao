export function paginate(data,page,size){

    const start =
        (page-1)*size;

    const end =
        start + size;

    return data.slice(start,end);
}