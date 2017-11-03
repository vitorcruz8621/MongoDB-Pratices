// 2 - dado um ISBN, qual o valor total de vendas desse livro?

var data = {
    "_id" : 1509556487846.0,
    "isbn" : "681-990-636-415"
}

db.runCommand({
    aggregate: "sales",
    pipeline: [
        {
            $match: {
                "items.isbn": {
                    $regex : ".*"+data.isbn+".*", $options : "i"
                }
            }
        },
        {
            $project: {
                items: {
                    $filter: {
                        input: "$items",
                        as: "item",
                        cond: { $eq: [ "$$item.isbn", data.isbn ] }
                    }
                }
            }
        },
        {
            $group: {
                _id : {"id": "$items.isbn" }
                ,"total": { $sum: {$sum :"$items.price"} }
            }
        }
    ]
})