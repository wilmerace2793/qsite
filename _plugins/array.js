import lodash from 'lodash'

class Array {
  constructor() {
  }

  //Order array as tree
  tree(elements, fields = {}) {
    var trees = []
    var response = []
    fields = {label: 'title', id: 'id', parentId: 'parentId', ...fields}

    //Get parents ID
    elements.forEach(item => {
      if (!item[fields.parentId]) item[fields.parentId] = 0//Default parent ID
      let findId = false
      elements.forEach(j => {
        if (parseInt(j.id) == parseInt(item[fields.parentId])) findId = j
      })
      if (!findId) trees[item[fields.parentId]] = item[fields.parentId]
    })

    //Recursive funtion to order items
    let orderItems = (items) => {
      let responseOrder = []
      items.forEach(item => {
        let itemData = {id: item[fields.id], label: item[fields.label], value: item[fields.id]}
        if (item.children) itemData.children = orderItems(item.children)
        responseOrder.push({...item, ...itemData})
      })
      return responseOrder
    }

    //Build tree items
    trees.forEach((tree, index) => {
      this.builTree(elements, tree, fields).forEach(element => {
        let itemOrder = {
          label: element[fields.label],
          id: element[fields.id],
          value: element[fields.id]
        }
        if (element.children) itemOrder.children = orderItems(element.children)
        response.push({...element, ...itemOrder})
      })
    })

    return response//Response
  }

  builTree(elements, parentId = 0, fields = {}) {
    var branch = []
    fields = {parentId: 'parentId', ...fields}

    elements.forEach(element => {
      element[fields.parentId] ? false : element[fields.parentId] = 0
      if (element[fields.parentId] == parentId) {
        var children = this.builTree(elements, element.id, fields)
        let record = element
        if (children.length) {
          record['children'] = children
        }
        branch.push(record)
      }
    })

    return branch
  }

  /**
   * Order array in object for select
   *
   * @dataArray{object} = [{
   *   id: type int or string, -> require
   *   title: type string      -> require or full_name
   *   full_name: type string  -> require or title
   * }]
   *
   */
  select(dataArray, fields = {label: 'title', id: 'id'}) {
    let response = []
    dataArray.forEach((item) => {
      response.push({
        label: item[fields.label],
        id: item[fields.id],
        value: item[fields.id]
      })
    })

    return response
  }

  /**
   * Return all parents of id in array
   *
   * @dataArray{object} = [{
   *   id: type int or string, -> require
   *   title: type string      -> require
   *   parentId: type string  -> require
   * }]
   * @id{int} = 1
   *
   * @Return{object} = {
   *   name : type String    / 'parent > parent > parent' return all parents and children element
   *   parents: type String  / 'parent > parent > parent' return only parents
   *   name: type String     / [1,2,3] return ID parents and children element
   * }
   *
   */
  parents(dataArray, id, field = 'id') {
    id = parseInt(id)

    let response = {name: [], id: []}

    if (dataArray) {
      while (id >= 1) {
        let parent = dataArray.find(item => item[field] === id)
        if (parent) {
          response.name.unshift(parent.title)
          response.id.unshift(parent.id)
          id = parseInt(parent.parentId)
        }
      }
    }

    response.parents = response.name.slice(0, response.name.length - 1).join(' > ')
    response.name = response.name.join(' > ')

    return response
  }

  /**
   * Return all ID children of id in array
   *
   * @dataArray{object} = [{
   *   id: type int or string, -> require
   *   parentId: type string  -> require
   * }]
   * @id{int} = 1
   *
   * @Return{array} = [1,2,3...] ID of all children
   *
   */
  children(dataArray, id, excludeParent, type) {
    /*recursive function*/
    let childrens = (parentId) => {
      let response = []

      //add to "response" the ID children of parentId
      dataArray.filter((item) => {
        if (item.parentId == parentId) {
          if (!type) {
            response.push(item.id)
          } else {
            response.push(item)
          }

          let children = childrens(item.id) //get children from this source

          children.length ? response.push(children) : false
        }
      })

      return response
    }

    /*return array merge with all children ID*/
    let data = [].concat.apply([], childrens(parseInt(id)))
    !excludeParent ? data.unshift(id) : false //Add ID from parameter
    return data
  }

  /* difference between two arrays */
  diff(arr1, arr2) {
    var diff = {}

    diff.arr1 = arr1.filter(function (value) {
      if (arr2.indexOf(value) === -1) {
        return value
      }
    })

    diff.arr2 = arr2.filter(function (value) {
      if (arr1.indexOf(value) === -1) {
        return value
      }
    })

    diff.concat = diff.arr1.concat(diff.arr2)

    return diff
  };

  /* find into array by param*/
  findByTag(array, tag, value) {
    let response = false
    if (array && tag && value) {
      array.forEach((item) => {
        if (item[tag].toString() === value.toString()) {
          response = item
        }
      })
    }
    return response
  }

  //Destroy tree
  destroyTree(data) {
    let response = []
    //Destroy tree
    data.forEach(item => {
      if (item.children) {
        let children = item.children || []
        delete item.children
        response = [...response, item, ...children]
      } else {
        response = [...response, item]
      }
    })
    //Response
    return response
  }

  //Get parents
  getParents(params = {}) {
    //Get default params
    let dataItems = params.dataItems || []
    let compareId = params.compareId || 0
    let idfield = params.idField || 'id'
    let parentField = params.parentField || 'parentId'
    let labelField = params.labelField || 'title'
    //Default response
    let response = {items: [], itemNames: []}

    if (dataItems && compareId) {
      while ((compareId != '0') || (compareId != 0)) {
        //Find parent
        let parentItem = dataItems.find(item => item[idfield] === compareId)
        //Set parent to response
        if (parentItem) {
          response.items.unshift(parentItem)
          response.itemNames.unshift(parentItem[labelField])
          compareId = parentItem[parentField]
        }
      }
    }

    //Response
    return response
  }

  hasCommonElement(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.includes(arr1[i])) {
        return true;  // Found a common element
      }
    }
    return false;  // No common element found
  }

  mergeUniqueBy(dataToMerge, keyToCompare = '') {
    return lodash.uniqBy(dataToMerge, keyToCompare)
  }
}

const array = new Array();

export default array;

export {array};
