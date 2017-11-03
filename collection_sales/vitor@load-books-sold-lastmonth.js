//5 - dado um ISBN, qual o valor e a quantidade de vendas desse livro no mes passado? E traga o nome e o nome dos autores desse livro

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
        }
        ,{
            $unwind: "$items"
        }
        ,{
            $unwind: "$items.soldAt"
        }
        ,{
            $group: {
                _id : {
                    "id": "$items.isbn"
                    ,"ano": {"$year": "$items.soldAt"}
                    ,"mês": {
                        "$month": {
                            /*
                            lógica de "3-" e "4-", mas sem sucesso aqui
                            tentar fazer algo proximo de...
                            db.sales.find({ "items.soldAt" : { "$gte" : ISODate("2017-10-01T00:00:01Z"), "$lt" : ISODate("2017-10-31T00:00:00Z") }})
                            */
                            "$items.soldAt" : {
                                $gt: ISODate("2017-10-01T00:00:01.000Z"),
                                $lt: ISODate("2017-10-31T23:59:59.000Z")
                            }
                        }
                    }
                },
                "preço": { $sum: {$sum :"$items.price"} },
                "quantidade": {$sum:1}
                
            }
        }
    ]
})