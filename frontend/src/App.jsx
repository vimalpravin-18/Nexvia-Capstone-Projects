import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import ProductCard from './components/ProductCard'

function App() {

  const[selectCategory, setSelectCategory] = useState("All");

   const[search, setSearch] = useState("");

  const products = [
    {id:1, name:'IPhone 17 Pro MAX', price:65000, url:'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSRUPmorMvQLVmDy9jd5Q5s8LjydpGfck1KYpyDGfK_Bes6pXVyTS_iKUG8mE71zWcqe_iYbBcY6EQpfhVjd01O0somAAAjz1RTzjaLvJLPCbNdooj8LNEFFoMO35ZN93CfNUJomnMo&usqp=CAc' , category:'Mobile'},
    {id:2 , name:'Boat Earphone' ,price:65000 , url:'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRJiZwTIqBPdCKS8UMutAbjkvrsefAND_is_2Nd9YlpMHeOCUYvyWE0w81z8CUeyDFRY4CqV0KjxWgFUj6xMskNzUJissjhZyEHJytg9njeaNPMx1t2BQUKbZzHy5VV9FIdhLwIaOdJxg&usqp=CAc', category:'Accessories'},
    {id:3, name:'Samsung A15s', price:95000, url:'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS6CEwFZJQTlqnYOhOS9BWZEMQJryOhdQsmuRE-tRH3ukjvleSkTaBxR3ntEgykv1xWUoc0AGtMr-Bf779V_Fsi_YOvLSc_I5jXGPsxg49w4iN0UCkJ-8Ni6ZsUksh0cer01pFyjuuOHK8&usqp=CAc', category:'Mobile'},
  ]

  const filteredProducts = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = 
      selectCategory === 'All' ||
      product.category === selectCategory;

      return matchesCategory && matchesSearch;

});

 

  return (
    <>
      <div>
          <Navbar />

        <div className='search-bar'>
          <input 
              type='text' 
              placeholder='Search Products ..'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
          />
          <div className='filter'>
            <button onClick={() => setSelectCategory("All")}>All</button>
            <button onClick={() => setSelectCategory("Mobile")}>Mobiles</button>
            <button onClick={() => setSelectCategory("Accessories")}>Accessories</button>
        </div>
        </div> 

        

          <div className='product-list'>
              {filteredProducts.length > 0 ?   (filteredProducts.map((product) => (
                  <ProductCard 
                        key={product.id} 
                        name={product.name} 
                        price={product.price} 
                        url={product.url}
                  />
              ))
              ) : ( 
              <p className='Not-Found'>No Product Found !</p> 
            )}
          </div>
      </div>
    </>
  )
}

export default App
