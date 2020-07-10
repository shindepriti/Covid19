import React from  'react'
import {shallow, configure} from 'enzyme'
import Search from '../components/Searchbar'
import Adapter from 'enzyme-adapter-react-16';

configure({adapter:new Adapter})

// eslint-disable-next-line no-undef
describe(`Test Cases To Search Component `,()=>{


    // eslint-disable-next-line no-undef
    it(`givenSearch_whenEnter_shouldReturnTrue`,()=>{
        // eslint-disable-next-line no-undef
        expect(shallow(<Search/>).find('#search').length).toEqual(1)
    })
})

