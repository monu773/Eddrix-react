import { useState, useEffect } from "react";
import { Table, Checkbox, Button, Input } from "antd";
import axios from "axios";

const TableRenderer = () => {
  // for data fetching
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  // for selecting columns
  const [selectedColumns, setSelectedColumns] = useState([]);

  // for search
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const CheckboxGroup = Checkbox.Group;

  const [plainOptions, setPlainOptions] = useState();
  const [checkedList, setCheckedList] = useState();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setData(response?.data);

      const dataKeys = Object.keys(response?.data[0]);

      const columns = dataKeys.map((key) => ({
        title: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter of the key
        dataIndex: key, // Set dataIndex to the key
        key: key, // Set key to the key
      }));

      const titles = columns.map(column => column.title);
      setPlainOptions(titles)
      setCheckedList(titles)

      setColumns(columns);
      setSelectedColumns(columns);

      setFilteredData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // fetch('https://jsonplaceholder.typicode.com/users')
  // set data and columns from the above fetched data
  // then select the columns using checkboxes and click on submit button to diplay the data in the table

  const onChange = (list) => {
    setCheckedList(list);
  };


  const changeFilterData = () => {
    const filteredColumns = columns.filter(column => checkedList.includes(column.title));
    setSelectedColumns(filteredColumns);
  }

  const searchData = (searchValue) => {
    const query = searchValue.toLowerCase();
    setSearchText(query);

    const filtered = {};
    for (const key in data) {
        const value = data[key];
        if (typeof value === 'string' && value.toLowerCase().includes(query)) {
            filtered[key] = value;
            console.log(value, "V!V!V!");
        } else if (typeof value === 'object') {
            const nestedFiltered = {};
            for (const nestedKey in value) {
                const nestedValue = value[nestedKey];
                if (typeof nestedValue === 'string' && nestedValue.toLowerCase().includes(query)) {
                    nestedFiltered[nestedKey] = nestedValue;
                }
            }
            if (Object.keys(nestedFiltered).length > 0) {
                filtered[key] = nestedFiltered;
            }
        }
    }

    const index = Object.keys(filtered);
    const keys = Object.keys(data);
    const keyAtIndex = keys[index];
    filterDataByIndex(keyAtIndex);

    if(searchValue.length == 0) {
      setFilteredData(data);
    }

}

const filterDataByIndex = (index) => {
  const filtered = data.filter((item, i) => i == index);
  setFilteredData(filtered);
};

  // Implement your own functions according to the usecase

  return (
    <div style={{padding: "20px"}}>
      {/* Implement Checkboxes */}
      <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
      <br />
      {/* Implement submit button - only after clicking this button and selecting the above checkboxes, the data must be populated to the table */}
      <Button type="primary" style={{marginTop: "32px", marginBottom:"32px"}} onClick={changeFilterData}>Submit</Button>
      {/* Implement Search */}
      <Input placeholder="Search..." style={{marginBottom: "16px"}} value={searchText} onChange={(e) => searchData(e.target.value)} />
      <Table dataSource={filteredData} columns={selectedColumns} />
    </div>
  );
};

export default TableRenderer;
