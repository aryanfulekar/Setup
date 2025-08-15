import React from 'react'
import Post from './Post'

function Posts() {


  return (
    <div className='flex flex-col items-center bg-gray-200'>
    {[1,2,3,4].map((item,index)=><Post key={index} />)}
    </div>
  )
}

export default Posts