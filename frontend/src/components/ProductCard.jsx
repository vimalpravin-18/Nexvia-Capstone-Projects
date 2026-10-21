import './ProductCard.css'

function ProductCard({name , price, url}) {

    return (

        <>
            <div className="header">
                <div className="product-img">
                    <img src={url} alt="Mobile Image"/>
                </div>
                    
                <h2>{name}</h2>
                <p>Price : {price}</p>

                <div className="btn">
                    <button type="button">Add to cart</button>

                    <h3>Exclusive</h3>
                </div>
            </div>
        </>
    )
}

export default ProductCard