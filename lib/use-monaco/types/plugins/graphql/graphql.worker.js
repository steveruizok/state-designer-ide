"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLWorker = void 0;
const worker_1 = require("../../worker");
const graphql_1 = require("graphql");
const graphql_language_service_1 = require("graphql-language-service");
const utils_1 = require("./utils");
class GraphQLWorker extends worker_1.MonacoWorker {
    constructor(ctx, createData) {
        super(ctx, createData);
        this.provideHover = async (model, position) => {
            const info = await this.doHover(model.uri.toString(), position);
            return {
                contents: [{ value: info.content }],
                range: {
                    ...info.range,
                    startLineNumber: info.range.startLineNumber + 1,
                    endLineNumber: info.range.endLineNumber + 1,
                },
            };
        };
        this.provideCompletionItems = async (model, pos, ctx) => {
            const info = await this.doComplete(model.uri.toString(), pos);
            return {
                suggestions: info,
            };
        };
        this.resolveCompletionItem = async (item) => {
            return item;
        };
        this._ctx = ctx;
        this._languageService = new graphql_language_service_1.LanguageService(createData.languageConfig);
        this._formattingOptions = createData.formattingOptions;
    }
    async getSchemaResponse(_uri) {
        return this._languageService.getSchemaResponse();
    }
    async setSchema(schema) {
        await this._languageService.setSchema(schema);
    }
    async loadSchema(_uri) {
        return this._languageService.getSchema();
    }
    async validate(uri) {
        const document = this.getText(uri);
        const graphqlDiagnostics = await this._languageService.getDiagnostics(uri, document);
        return graphqlDiagnostics.map(utils_1.toMarkerData);
    }
    async doComplete(uri, position) {
        const document = this.getText(uri);
        const graphQLPosition = utils_1.toGraphQLPosition(position);
        const suggestions = await this._languageService.getCompletion(uri, document, graphQLPosition);
        return suggestions.map((suggestion) => utils_1.toCompletion(suggestion));
    }
    async doHover(uri, position) {
        const document = this.getText(uri);
        const graphQLPosition = utils_1.toGraphQLPosition(position);
        const hover = await this._languageService.getHover(uri, document, graphQLPosition);
        return {
            content: hover,
            range: utils_1.toMonacoRange(graphql_language_service_1.getRange({
                column: graphQLPosition.character,
                line: graphQLPosition.line,
            }, document)),
        };
    }
    async doValidation(uri) {
        return await this.validate(uri);
    }
    async getSchema() {
        return await this.loadSchema(this.options.languageConfig.schemaConfig.uri).then((schema) => {
            return graphql_1.printSchema(schema);
        });
    }
    async doParse(text) {
        return this._languageService.parse(text);
    }
}
exports.GraphQLWorker = GraphQLWorker;
//# sourceMappingURL=graphql.worker.js.map