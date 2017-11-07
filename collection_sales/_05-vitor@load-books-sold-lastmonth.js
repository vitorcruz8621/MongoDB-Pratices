//5 - dado um ISBN, qual o valor e a quantidade de vendas desse livro no mes passado? E traga o nome e o nome dos autores desse livro

var data = {
    "_id" : 1509556487846.0,
    "isbn" : "681-990-636-415"
}

db.runCommand({
    aggregate : "sales_copy",
    pipeline: [
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
            $lookup:
            {
                from: "books",
                localField: "items.isbn",
                foreignField: "isbn",
                as: "book_info"
            }
        }
        ,{
            $match: {
                "items.isbn" : data.isbn,
                "items.soldAt" : {
                    $gte : 1506826800000.0, $lte: 1509505199000.0
                }
            }
        }
        ,{
            $group:{
                _id : {
                    "id" : "$items.isbn",
                    "Autor(es)" : "$book_info.nome_autor.autor",
                    "Título" : "$book_info.nome_livro",
                    //book_info.nome_autor.autor
                }
                
                ,"preço": { $sum: {$sum :"$items.price"} }
                ,"quantidade": {$sum:1}
            }
        }
    ]
})

//output
/*
{
    "result" : [ 
        {
            "_id" : {
                "id" : [ 
                    "681-990-636-415"
                ],
                "Autor(es)" : [ 
                    [ 
                        "Vitor Cruz", 
                        "Daiane Eustaquio"
                    ]
                ],
                "Título" : [ 
                    "Livro 150953955"
                ]
            },
            "preço" : 377.23,
            "quantidade" : 3.0
        }
    ],
    "ok" : 1.0
}
*/