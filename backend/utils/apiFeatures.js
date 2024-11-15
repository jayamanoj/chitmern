class APIFeatures {
    constructor(query, queryStr) {  // Corrected the typo
        this.query = query;
        this.queryStr = queryStr;   // Corrected the typo
    }

    search() {
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i' // 'i' for case-insensitive search
            }
        } : {};

        this.query.find({ ...keyword }); // Assign the query result to this.query
        return this;
    }

    filter(){
        const queryStrcopy ={...this.queryStr};
        const removeFields=['keyword','limit','page']
        removeFields.forEach(field=> delete queryStrcopy[field] )
        this.query.find(queryStrcopy);
        return this;
    }

    paginate() {
        const page = this.queryStr.page * 1 || 1; // Convert to number, default to 1
        const limit = this.queryStr.limit * 5 || 5; // Convert to number, default to 10
        const skip = (page - 1) * limit; // Calculate number of documents to skip

        this.query = this.query.limit(limit).skip(skip); // Apply limit and skip to the query
        return this;
    }
}

module.exports = APIFeatures;
