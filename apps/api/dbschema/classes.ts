
class BaseObject  {
  public id: string;

  constructor(id: string) {
    
    this.id = id;
  }
}


class $Object extends BaseObject {
  

  constructor(id: string) {
    super(id);

  }
}


class FreeObject extends BaseObject {
  

  constructor(id: string) {
    super(id);

  }
}


class Pet extends $Object {
  public name: string;

  constructor(id: string, name: string) {
    super(id);
    this.name = name;
  }
}